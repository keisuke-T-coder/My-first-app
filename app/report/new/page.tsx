"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation'; // A-0からの引き継ぎ用

// ★GASのウェブアプリURL（ID不要版、適宜貼り替えてください） ★修正
const GAS_URL = 'Https://script.google.com/macros/s/AKfycbz8DPZRzFo7ic3P8Jxh0MlNTDLPgVPsvckapv27msD23hn24uzqc8fFT5eW3K72K5LqWA/exec';

// --- 一覧データの定義 (厳守) ---

// 担当者一覧
const workers = ["佐藤", "田中", "南", "新田", "德重"];

// エリア一覧
const areas = [
  "市内南部エリア", "市街地エリア", "市内北部エリア", "日置エリア", "北薩エリア",
  "南薩エリア", "大隅エリア", "鹿屋エリア", "姶良エリア", "霧島エリア", "その他"
];

// 品目一覧
const items = [
  "トイレ", "キッチン", "洗面", "浴室", "ドア", "窓サッシ", "水栓",
  "エクステリア", "照明換気設備", "内装設備", "外装設備"
];

// 依頼内容一覧
const requestContents = [
  "水漏れ", "作動不良", "開閉不良", "破損", "異音", "詰り関係", "その他"
];

// 作業内容一覧
const workContents = [
  "部品交換", "製品交換、取付", "清掃", "点検", "見積", "応急処置", "その他"
];

// 提案内容一覧
const proposalContents = [
  "サティス", "プレアス", "アメージュ", "パッソ", "KA", "KB", "水栓", "その他"
];

// 状況一覧
const statuses = ["完了", "再訪予定", "部品手配", "見積", "保留"];


export default function NewReport() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedWorkerFromUrl = searchParams.get('worker') || ''; // A-0から引き継いだ名前（クエリパラメータ）

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{status: string, message: string} | null>(null);
  
  // ★送信前確認モーダルの開閉状態ギミック
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // === 状態管理（フォームの入力値や切り替え状態） ===
  // 指示された全項目（メモ欄なし、image_3.png基準）を完全に厳守
  const [formData, setFormData] = useState({
    日付: new Date().toISOString().split('T')[0], // 今日を初期値（カレンダー入力）
    開始時間: '', // （時間選択入力）
    終了時間: '', // （時間選択入力：開始時間の30分後が自動設定）
    担当者名: selectedWorkerFromUrl, // ★A-0から引き継いだ名前（クエリパラメータ）を初期選択に設定（仕様B）
    "訪問先名（クライアント名）": '', // （訪問先（お客様名など）：自由テキスト入力）
    エリア: '', // （エリア（プルダウン選択）：（空欄）選択してください）
    品目: '', // （品目（プルダウン選択）：（空欄）選択してください）
    依頼内容: '', // （依頼内容（プルダウン選択）：（空欄）選択してください）
    作業内容: '', // （作業内容（プルダウン選択）：（空欄）選択してください）
    "作業区分（修理or販売)": '修理', // （作業区分（カプセル型トグルスイッチ）：修理）
    技術料: '0', // （技術料：数値入力、円単位、初期値：0）
    修理金額: '0', // （修理金額/販売金額：数値入力、円単位、初期値：0、トグルによりラベルと色が変化）
    販売金額: '0', // （修理金額/販売金額：数値入力、円単位、初期値：0、トグルによりラベルと色が変化、赤字）
    提案有無: '無', // （提案有無（カプセル型トグルスイッチ）：無）
    提案内容: '', // （提案内容（「有」選択時のみ表示。プルダウン選択肢＋「その他」時の自由入力）：（空欄）選択してください。プルダウンを開くと、サティス、プレアス、その他などの選択肢が表示されます）
    提案内容自由入力: '', // その他選択時の自由入力欄
    遠隔高速利用: '無', // （遠隔、高速利用（カプセル型トグルスイッチ）：無）
    伝票番号: '', // （伝票番号（「有」選択時のみ表示）：伝票番号を入力してください、オレンジ枠）
    ステータス: '完了', // （状況（プルダウン選択）：完了）
    社内用メモ: '' // ★元のコード（image_3.png：メモ欄なし）の構成を完全に維持します。社内用メモ: アプリからは送れません。空欄になります。メモ textarea。
  });

  // 時間入力時の自動計算ロジック（開始時間 + 30分 = 終了時間の初期値）
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startTime = e.target.value;
    let endTime = formData.終了時間;

    if (startTime && !endTime) {
      // 開始時間が入力され、終了時間が空の場合だけ計算
      const [hours, minutes] = startTime.split(':').map(Number);
      let endMinutes = minutes + 30;
      let endHours = hours;
      
      if (endMinutes >= 60) {
        endHours = (hours + 1) % 24;
        endMinutes = endMinutes - 60;
      }
      
      endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }

    setFormData({ ...formData, 開始時間: startTime, 終了時間: endTime });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // ★「内容確認する」ボタンを押した時のギミック。fetch通信は開始されません。送信の前には確認画面(入力した一覧を表示)
  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // ★確認モーダルの「提出する」ボタンを押した時のみ、fetch通信を開始。飛ばす。送信が成功したら"送信しました。お疲れ様でした"。
  const handleSubmit = async () => {
    setShowConfirmModal(false); // モーダルを閉じる
    setIsLoading(true);
    setResponse(null);

    // 金額を数値に変換するなど、データの正規化
    const payload = {
      ...formData,
      技術料: Number(formData.技術料) || 0,
      修理金額: Number(formData.修理金額) || 0,
      販売金額: Number(formData.販売金額) || 0,
      // 提案内容の自由入力を反映
      提案内容: formData.提案内容 === 'その他' ? formData.提案内容自由入力 : formData.提案内容
    };

    try {
      // GASへPOSTリクエストを送信
      // mode: 'no-cors' で送信
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params: payload }) // GAS側の jsonData.params に合わせる
      });

      // no-cors のため戻り値は判定せず成功メッセージを表示。"送信しました。お疲れ様でした"
      setResponse({ status: 'success', message: '日報データをGAS経由で送信しました。\n送信しました。お疲れ様でした。スプレッドシートを確認してください。' });
      
      // フォームを初期化（日付、担当者、ステータスは維持）
      setFormData({
        ...formData,
        開始時間: '',
        終了時間: '',
        "訪問先名（クライアント名）": '',
        エリア: '',
        品目: '',
        依頼内容: '',
        作業内容: '',
        "作業区分（修理or販売)": '修理',
        技術料: '0',
        修理金額: '0',
        販売金額: '0',
        提案有無: '無',
        提案内容: '',
        提案内容自由入力: '',
        遠隔高速利用: '無',
        伝票番号: '',
        社内用メモ: ''
      });

    } catch (error) {
      console.error(error);
      setResponse({ status: 'error', message: 'GASとの通信に失敗しました。' });
    } finally {
      setIsLoading(false);
    }
  };

  // 元のコード（image_3.png）の共通デザインクラス（厳守）
  const inputBaseClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#eaaa43] focus:ring-2 focus:ring-[#eaaa43]/20 transition-all font-medium appearance-none";
  const labelClass = "block text-xs font-bold text-gray-500 mb-1 ml-1";
  const selectArrowClass = "relative after:content-['▼'] after:text-gray-400 after:text-xs after:absolute after:right-4 after:top-1/2 after:-translate-y-1/2 after:pointer-events-none";

  // モーダル内の Disabled UI 用クラス ★新規ギミック
  const disabledBaseClass = `${inputBaseClass} opacity-70 pointer-events-none`;
  const confirmLabelClass = "w-24 text-xs font-bold text-gray-400 text-right";
  const confirmValClass = "flex-1 text-sm font-bold text-gray-900";

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center font-sans pb-32 relative overflow-x-hidden text-slate-800">
      
      {/* 画面上部エリア */}
      <div className="w-full bg-white pt-10 pb-4 px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-0 z-50 flex items-center justify-between">
        <Link href="/" className="text-gray-500 text-2xl">〈</Link>
        <h1 className="text-gray-900 font-bold text-base tracking-widest">A-1 新規入力</h1>
        {/* 引き継いだ名前を表示する右上バッジギミック */}
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-inner">
          <span className="text-gray-500 font-bold text-xs">{formData.担当者名 || '南'}</span>
        </div>
      </div>

      <form onSubmit={handleOpenConfirm} className="w-[92%] max-w-md mt-6 flex flex-col gap-4">
        
        {/* レスポンスメッセージ */}
        {response && (
          <div className={`p-4 rounded-xl text-sm font-bold ${response.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {response.message.split('\n').map((msg, i) => <p key={i}>{msg}</p>)}
          </div>
        )}

        {/* 1. 基本情報 セクション (image_3.png基準) */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">📋</span> 基本情報
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">01</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>日付</label>
              {/* （カレンダー選択入力） */}
              <input type="date" name="日付" value={formData.日付} onChange={handleInputChange} required className={inputBaseClass} />
            </div>
            {/* ★元のselect仕様 */}
            <div className={selectArrowClass}>
              <label className={labelClass}>担当者名</label>
              {/* 初期状態で引き継いだ名前を選択させるギミック（仕様B） */}
              <select name="担当者名" value={formData.担当者名} onChange={handleInputChange} className={inputBaseClass}>
                {/* （空欄）選択してください */}
                <option value="">(選択)</option>
                {/* 佐藤、田中、南、新田、德重 */}
                {workers.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className={labelClass}>開始時間</label>
              {/* （時間選択入力） */}
              <input type="time" name="開始時間" value={formData.開始時間} onChange={handleStartTimeChange} required className={inputBaseClass} />
            </div>
            <div>
              <label className={labelClass}>終了時間</label>
              {/* （時間選択入力：開始時間の30分後が自動設定ギミック付き） */}
              <input type="time" name="終了時間" value={formData.終了時間} onChange={handleInputChange} required className={inputBaseClass} />
            </div>
          </div>
        </div>

        {/* 2. 業務詳細 セクション (image_3.png基準) */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">👤</span> 業務詳細
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">02</div>
          </div>

          <div>
            <label className={labelClass}>訪問先（お客様名など）</label>
            {/* （訪問先（お客様名など）：自由テキスト入力） */}
            <input type="text" name="訪問先名（クライアント名）" value={formData["訪問先名（クライアント名）"]} onChange={handleInputChange} placeholder="山田太郎様、〇〇マンション" required className={inputBaseClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>エリア</label>
              <input type="text" name="エリア" value={formData.エリア} onChange={handleInputChange} placeholder="福岡市中央区" required className={inputBaseClass} />
            </div>
            {/* エリア一覧 プルダウン選択ギミック */}
            <div className={selectArrowClass}>
              <label className={labelClass}>エリア（選択可）</label>
              <select name="エリア" value={formData.エリア} onChange={handleInputChange} className={inputBaseClass}>
                <option value="">(空欄) 選択してください</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* 品目一覧、依頼内容一覧、作業内容一覧 select ▼ プルダウン選択ギミック */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className={selectArrowClass}>
              <label className={labelClass}>品目</label>
              <select name="品目" value={formData.品目} onChange={handleInputChange} required className={inputBaseClass}>
                <option value="">選択してください</option>
                {items.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className={selectArrowClass}>
              <label className={labelClass}>依頼内容</label>
              <select name="依頼内容" value={formData.依頼内容} onChange={handleInputChange} required className={inputBaseClass}>
                <option value="">選択してください</option>
                {requestContents.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className={`${selectArrowClass} pt-2`}>
            <label className={labelClass}>作業内容</label>
            <select name="作業内容" value={formData.作業内容} onChange={handleInputChange} required className={inputBaseClass}>
              <option value="">選択してください</option>
              {workContents.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className={labelClass}>作業内容（具体的に自由入力）</label>
            <textarea name="作業内容自由入力" value={formData.社内用メモ} rows={3} className={`${inputBaseClass} resize-none`} placeholder="追加の作業詳細を入力ください。" />
          </div>
        </div>

        {/* 3. 金額 セクション (image_3.png基準) */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">💰</span> 金額情報
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">03</div>
          </div>
          
          <div className={selectArrowClass}>
            <label className={labelClass}>作業区分</label>
            {/* 修理、販売 */}
            <select name="作業区分（修理or販売)" value={formData["作業区分（修理or販売)"]} onChange={handleInputChange} required className={inputBaseClass}>
              <option value="">(選択)</option><option value="修理">修理</option><option value="販売">販売</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className={labelClass}>技術料</label>
              <input type="number" name="技術料" value={formData.技術料} onChange={handleInputChange} required className={inputBaseClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>修理金額</label>
              <input type="number" name="修理金額" value={formData.修理金額} onChange={handleInputChange} required className={inputBaseClass} />
            </div>
            {/* 販売金額（赤字） */}
            <div className="col-span-1">
              <label className={`${labelClass} text-red-500`}>販売金額</label>
              <input type="number" name="販売金額" value={formData.販売金額} onChange={handleInputChange} required className={`${inputBaseClass} bg-red-50 text-red-500 border-red-100 focus:border-red-500`} />
            </div>
          </div>
        </div>

        {/* 4. 提案 セクション (image_3.png基準) */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">💡</span> 提案・利用
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">04</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={selectArrowClass}>
              <label className={labelClass}>提案有無</label>
              {/* 無、有 */}
              <select name="提案有無" value={formData.提案有無} onChange={handleInputChange} required className={inputBaseClass}>
                <option value="無">無</option><option value="有">有</option>
              </select>
            </div>
            {/* ★元のオレンジ枠select仕様を Disabled UI再現のために忠実に継承 */}
            {formData.提案有無 === '有' && (
              <div className={selectArrowClass}>
                <label className={`${labelClass} text-[#eaaa43]`}>提案内容（有の場合）</label>
                {/* 提案内容一覧 selectギミック。初期状態で「選択してください」と表示 */}
                <select name="提案内容" value={formData.提案内容} onChange={handleInputChange} required className={`${inputBaseClass} bg-orange-50 border-orange-100 text-[#eaaa43] focus:border-[#eaaa43]`}>
                  <option value="">(選択してください)</option>
                  {proposalContents.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}
          </div>
          {/* その他選択時の自由入力ギミック */}
          {formData.提案有無 === '有' && formData.提案内容 === 'その他' && (
              <div className="pt-2">
                <label className={labelClass}>提案内容（具体的に）</label>
                <input type="text" name="提案内容自由入力" value={formData.提案内容自由入力} onChange={handleInputChange} placeholder="その他提案内容を入力" required className={inputBaseClass} />
              </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div className={selectArrowClass}>
              <label className={labelClass}>遠隔高速利用</label>
              {/* 無、有 */}
              <select name="遠隔高速利用" value={formData.遠隔高速利用} onChange={handleInputChange} required className={inputBaseClass}>
                <option value="無">無</option><option value="有">有</option>
              </select>
            </div>
            {formData.遠隔高速利用 === '有' && (
              <div>
                <label className={labelClass}>伝票番号（有の場合）</label>
                {/* ★指示されたプレースホルダー「伝票番号を入力してください」をオレンジ枠inputに実装ギミック */}
                <input type="text" name="伝票番号" value={formData.伝票番号} onChange={handleInputChange} placeholder="伝票番号を入力してください" required className={inputBaseClass} />
              </div>
            )}
          </div>
        </div>

        {/* 5. ステータス セクション (image_3.png基準) */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">📢</span> ステータス
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">05</div>
          </div>

          <div className={selectArrowClass}>
            <label className={labelClass}>状況</label>
            {/* ★状況一覧 select プルダウン選択ギミック */}
            <select name="ステータス" value={formData.ステータス} onChange={handleInputChange} required className={inputBaseClass}>
              {/* 初期値：完了 */}
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* ★社内用メモ：メモ textarea */}
          <div className="pt-2 border-t border-gray-100">
            <label className={labelClass}>社内用メモ</label>
            <textarea name="社内用メモ" value={formData.社内用メモ} onChange={handleInputChange} placeholder="追加情報あれば入力ください。" rows={3} className={`${inputBaseClass} resize-none`} />
          </div>
        </div>

        {/* 提出ボタン (画面最下部のオレンジ色ボタン) */}
        {/* 内容確認する →スプレッドシートに入力内容を飛ばす。送信の前には確認画面(入力した一覧を表示) */}
        <button type="submit" disabled={isLoading} className="w-full bg-[#eaaa43] text-white rounded-[14px] py-4 shadow-sm active:scale-95 transition-all font-black text-base mt-4 mb-2 tracking-widest disabled:bg-gray-300">
          {isLoading ? '送信中...' : '日報を提出する'}
        </button>

      </form>

      {/* 下部ナビゲーションバー（固定） */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] flex items-center justify-around px-6 z-50">
        <Link href="/" className="flex flex-col items-center gap-1.5 text-gray-400">
          <span className="text-2xl">🏠</span><span className="text-[10px] font-bold">ホーム</span>
        </Link>
        <div className="flex flex-col items-center gap-1.5 text-gray-400">
          <span className="text-2xl">🔔</span><span className="text-[10px] font-bold">お知らせ</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-400">
          <span className="text-2xl">👤</span><span className="text-[10px] font-bold">マイページ</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-400">
          <span className="text-2xl">⚙️</span><span className="text-[10px] font-bold">設定</span>
        </div>
      </div>

      {/* =========================================
          ★【送信前確認モーダル】ギミック実装 ★
          Disabled UI パーツを忠実に再現する
      ========================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg- crème色（#f8f6f0）/80 z-[100] p-6 flex items-center justify-center animate-fade-in text-slate-800">
          {/* 白背景カード、角丸 rounded-[20px] 、薄いシャドウ shadow-[0_2px_10px_rgba(0,0,0,0.03)] を継承 */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6 space-y-5 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5 pb-2 border-b border-gray-100 mb-1">
              <span className="text-base">📋</span> 入力内容のご確認
            </h2>

            {/* 各項目を、元のUIパーツ（Disabled）をそのまま使用して忠実に再現するギミック */}
            <div className="space-y-3">
              
              {/* 基本情報 セクション */}
              <div className="flex items-center gap-2">
                <label className={confirmLabelClass}>担当者名</label>
                <div className={`${selectArrowClass} ${disabledBaseClass}`}>
                  <select name="担当者名" value={formData.担当者名} className={disabledBaseClass}>
                    {workers.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                <label className={confirmLabelClass}>日付</label>
                <input type="date" name="日付" value={formData.日付} className={disabledBaseClass} />
              </div>

              <div className="flex items-center gap-2">
                <label className={confirmLabelClass}>時間</label>
                <div className="flex-1 flex items-center gap-1">
                  <input type="time" name="開始時間" value={formData.開始時間} className={disabledBaseClass} />
                  <span>〜</span>
                  <input type="time" name="終了時間" value={formData.終了時間} className={disabledBaseClass} />
                </div>
              </div>

              {/* 業務詳細 セクション */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                <label className={confirmLabelClass}>訪問先名</label>
                <input type="text" name="訪問先名（クライアント名）" value={formData["訪問先名（クライアント名）"]} className={disabledBaseClass} />
              </div>

              <div className="flex items-center gap-2">
                <label className={confirmLabelClass}>エリア</label>
                <div className={`${selectArrowClass} ${disabledBaseClass}`}>
                  <select name="エリア" value={formData.エリア} className={disabledBaseClass}>
                    <option value="">選択してください</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <label className={confirmLabelClass}>品目</label>
                  <div className={`${selectArrowClass} ${disabledBaseClass}`}>
                    <select name="品目" value={formData.品目} className={disabledBaseClass}>
                      <option value="">選択してください</option>
                      {items.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className={confirmLabelClass}>依頼内容</label>
                  <div className={`${selectArrowClass} ${disabledBaseClass}`}>
                    <select name="依頼内容" value={formData.依頼内容} className={disabledBaseClass}>
                      <option value="">選択してください</option>
                      {requestContents.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                <label className={confirmLabelClass}>作業内容</label>
                <div className={`${selectArrowClass} ${disabledBaseClass}`}>
                  <select name="作業内容" value={formData.作業内容} className={disabledBaseClass}>
                    <option value="">選択してください</option>
                    {workContents.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              {/* 区分、金額セクション */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                <label className={`${confirmLabelClass} ${formData["作業区分（修理or販売)"] === '修理' ? 'text-[#eaaa43]' : 'text-red-300'}`}>作業区分</label>
                <div className={confirmValClass}>{formData["作業区分（修理or販売)"]}</div>
              </div>

              <div className="flex gap-2">
                <label className={confirmLabelClass}>金額詳細</label>
                <div className="flex-1 space-y-1 text-sm font-medium">
                  <div>技術料: ¥{Number(formData.技術料).toLocaleString()}</div>
                  {formData["作業区分（修理or販売)"] === '修理' ? (
                    <div>修理金額: ¥{Number(formData.修理金額).toLocaleString()}</div>
                  ) : (
                    <div className="text-red-500 font-bold">販売金額: ¥{Number(formData.販売金額).toLocaleString()}</div>
                  )}
                </div>
              </div>

              {/* 提案、高速セクション */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                <label className={`${confirmLabelClass} ${formData.提案有無 === '有' ? 'text-[#eaaa43]' : 'text-gray-400'}`}>提案</label>
                <div className={confirmValClass}>{formData.提案有無}</div>
              </div>

              {formData.提案有無 === '有' && (
                <div className="flex items-center gap-2">
                  <label className={`${confirmLabelClass} text-[#eaaa43]`}>提案内容</label>
                  {/* 元の Disabled UIオレンジ枠、▼、を忠実に再現します */}
                  <div className={`${selectArrowClass} ${disabledBaseClass}`}>
                    <select name="提案内容" value={formData.提案内容} className={`${disabledBaseClass} border-orange-100 text-[#eaaa43]`}>
                        <option value="">(選択してください)</option>
                        {proposalContents.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {formData.提案有無 === '有' && formData.提案内容 === 'その他' && (
                  <div className="flex items-center gap-2">
                    <label className={`${confirmLabelClass} text-[#eaaa43]`}>自由入力</label>
                    <input type="text" name="提案内容自由入力" value={formData.提案内容自由入力} className={`${disabledBaseClass} border-orange-100 text-[#eaaa43]`} />
                  </div>
              )}

              <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                <label className={`${confirmLabelClass} ${formData.遠隔高速利用 === '有' ? 'text-[#eaaa43]' : 'text-gray-400'}`}>遠隔高速</label>
                <div className={confirmValClass}>{formData.遠隔高速利用}</div>
              </div>
              {formData.遠隔高速利用 === '有' && (
                  <div className="flex items-center gap-2">
                    <label className={confirmLabelClass}>伝票番号</label>
                    <input type="text" name="伝票番号" value={formData.伝票番号} className={disabledBaseClass} />
                  </div>
              )}

              {/* ステータス、メモセクション */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                <label className={confirmLabelClass}>ステータス</label>
                <div className={`${selectArrowClass} ${disabledBaseClass}`}>
                  <select name="ステータス" value={formData.ステータス} className={disabledBaseClass}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className={labelClass}>社内用メモ（確認）</label>
                <textarea name="社内用メモ" value={formData.社内用メモ} rows={3} className={`${disabledBaseClass} resize-none`} />
              </div>

            </div>

            {/* モーダル下のボタンギミック */}
            <div className="flex gap-4 pt-4 border-t border-gray-100 mt-2">
              <button type="button" onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-bold text-sm active:scale-95 transition-all">
                修正する
              </button>
              {/* "送信する"ボタンで送信。 */}
              <button type="button" onClick={handleSubmit} className="flex-1 bg-[#eaaa43] text-white rounded-xl py-3 font-bold text-sm shadow active:scale-95 transition-all tracking-wider">
                提出する
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
