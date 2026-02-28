"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ★GASのURL
const GAS_URL = 'Https://script.google.com/macros/s/AKfycbz8DPZRzFo7ic3P8Jxh0MlNTDLPgVPsvckapv27msD23hn24uzqc8fFT5eW3K72K5LqWA/exec';

export default function NewReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{status: string, message: string} | null>(null);

  // フォームの状態管理
  const [formData, setFormData] = useState({
    日付: new Date().toISOString().split('T')[0], // 今日を初期値
    開始時間: '',
    終了時間: '',
    担当者名: '',
    "訪問先名（クライアント名）": '',
    エリア: '',
    品目: '',
    依頼内容: '',
    作業内容: '',
    "作業区分（修理or販売)": '',
    技術料: '0',
    修理金額: '0',
    販売金額: '0',
    提案有無: '無',
    提案内容: '',
    遠隔高速利用: '無',
    伝票番号: '',
    ステータス: '完了',
    社内用メモ: ''
  });

  // 時間入力時の自動計算ロジック（開始時間 + 30分 = 終了時間の初期値）
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startTime = e.target.value;
    let endTime = formData.終了時間;

    if (startTime && !endTime) {
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

  // 提出処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    // 金額を数値に変換するなど、データの正規化
    const payload = {
      ...formData,
      技術料: Number(formData.技術料) || 0,
      修理金額: Number(formData.修理金額) || 0,
      販売金額: Number(formData.販売金額) || 0,
    };

    try {
      // GASへPOSTリクエストを送信
      // mode: 'no-cors' で送信を優先
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params: payload }) // GAS側の jsonData.params に合わせる
      });

      // no-cors のため戻り値は判定せず成功メッセージを表示
      setResponse({ status: 'success', message: '日報データをGAS経由で送信しました。\nスプレッドシートを確認してください。' });
      
      // フォームを初期化（日付、担当者、ステータスは維持）
      setFormData({
        ...formData,
        開始時間: '',
        終了時間: '',
        "訪問先名（クライアント名）": '',
        エリア: '',
        依頼内容: '',
        作業内容: '',
        "作業区分（修理or販売)": '',
        技術料: '0',
        修理金額: '0',
        販売金額: '0',
        提案有無: '無',
        提案内容: '',
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

  // 共通の入力欄デザイン（スリム化、必須を解除） ★requiredを削除
  const inputBaseClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#eaaa43] focus:ring-2 focus:ring-[#eaaa43]/20 transition-all font-medium appearance-none";
  const labelClass = "block text-xs font-bold text-gray-500 mb-1 ml-1";
  const selectArrowClass = "relative after:content-['▼'] after:text-gray-400 after:text-xs after:absolute after:right-4 after:top-1/2 after:-translate-y-1/2 after:pointer-events-none";

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center font-sans pb-32 relative overflow-x-hidden text-slate-800">
      {/* ヘッダー */}
      <div className="w-full bg-white pt-10 pb-4 px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-0 z-50 flex items-center justify-between">
        <Link href="/report" className="text-gray-500 text-2xl">〈</Link>
        <h1 className="text-gray-900 font-bold text-base tracking-widest">A-1 新規入力</h1>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-inner">
          <span className="text-gray-500 font-bold text-xs">南</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-[92%] max-w-md mt-6 flex flex-col gap-4">
        
        {/* レスポンスメッセージ */}
        {response && (
          <div className={`p-4 rounded-xl text-sm font-bold ${response.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {response.message.split('\n').map((msg, i) => <p key={i}>{msg}</p>)}
          </div>
        )}

        {/* 01 基本情報 */}
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
              {/* ★requiredを削除、以下すべての項目 */}
              <input type="date" name="日付" value={formData.日付} onChange={handleInputChange} className={inputBaseClass} />
            </div>
            <div className={selectArrowClass}>
              <label className={labelClass}>担当者名</label>
              <select name="担当者名" value={formData.担当者名} onChange={handleInputChange} className={inputBaseClass}>
                <option value="">(選択)</option><option value="南">南</option><option value="山田">山田</option><option value="鈴木">鈴木</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className={labelClass}>開始時間</label>
              <input type="time" name="開始時間" value={formData.開始時間} onChange={handleStartTimeChange} className={inputBaseClass} />
            </div>
            <div>
              <label className={labelClass}>終了時間</label>
              <input type="time" name="終了時間" value={formData.終了時間} onChange={handleInputChange} className={inputBaseClass} />
            </div>
          </div>
        </div>

        {/* 02 業務詳細 */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">👤</span> 業務詳細
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">02</div>
          </div>

          <div>
            <label className={labelClass}>訪問先（クライアント）</label>
            <input type="text" name="訪問先名（クライアント名）" value={formData["訪問先名（クライアント名）"]} onChange={handleInputChange} placeholder="山田太郎様、〇〇マンション" className={inputBaseClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>エリア</label>
              <input type="text" name="エリア" value={formData.エリア} onChange={handleInputChange} placeholder="福岡市中央区" className={inputBaseClass} />
            </div>
            <div className={selectArrowClass}>
              <label className={labelClass}>品目</label>
              <select name="品目" value={formData.品目} onChange={handleInputChange} className={inputBaseClass}>
                <option value="">(選択)</option><option value="トイレ">トイレ</option><option value="水栓">水栓</option><option value="浴室">浴室</option><option value="キッチン">キッチン</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>依頼内容（選択可）</label>
            <input type="text" name="依頼内容" value={formData.依頼内容} onChange={handleInputChange} placeholder="部品交換、点検" list="request-contents" className={inputBaseClass} />
            <datalist id="request-contents">
              <option value="製品交換、取付"/><option value="部品交換"/><option value="点検"/><option value="清掃、調整"/><option value="応急処置"/><option value="見積作成"/>
            </datalist>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className={labelClass}>作業内容（具体的に）</label>
            <textarea name="作業内容" value={formData.作業内容} onChange={handleInputChange} placeholder="水栓パッキン交換実施。" rows={3} className={`${inputBaseClass} resize-none`} />
          </div>
        </div>

        {/* 03 金額情報 */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">💰</span> 金額情報
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">03</div>
          </div>
          
          <div className={selectArrowClass}>
            <label className={labelClass}>作業区分</label>
            <select name="作業区分（修理or販売)" value={formData["作業区分（修理or販売)"]} onChange={handleInputChange} className={inputBaseClass}>
              <option value="">(選択)</option><option value="修理">修理</option><option value="販売">販売</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className={labelClass}>技術料</label>
              <input type="number" name="技術料" value={formData.技術料} onChange={handleInputChange} className={inputBaseClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>修理金額</label>
              <input type="number" name="修理金額" value={formData.修理金額} onChange={handleInputChange} className={inputBaseClass} />
            </div>
            {/* 販売金額（赤字） */}
            <div className="col-span-1">
              <label className={`${labelClass} text-red-500`}>販売金額</label>
              <input type="number" name="販売金額" value={formData.販売金額} onChange={handleInputChange} className={`${inputBaseClass} bg-red-50 text-red-500 border-red-100 focus:border-red-500`} />
            </div>
          </div>
        </div>

        {/* 04 提案・利用（遠隔高速、伝票） */}
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
              <select name="提案有無" value={formData.提案有無} onChange={handleInputChange} className={inputBaseClass}>
                <option value="無">無</option><option value="有">有</option>
              </select>
            </div>
            {formData.提案有無 === '有' && (
              <div className={selectArrowClass}>
                <label className={labelClass}>提案内容（有の場合）</label>
                <select name="提案内容" value={formData.提案内容} onChange={handleInputChange} className={inputBaseClass}>
                  <option value="">(選択)</option><option value="サティス〜KB">サティス〜KB</option><option value="水栓">水栓</option><option value="その他">その他</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div className={selectArrowClass}>
              <label className={labelClass}>遠隔高速利用</label>
              <select name="遠隔高速利用" value={formData.遠隔高速利用} onChange={handleInputChange} className={inputBaseClass}>
                <option value="無">無</option><option value="有">有</option>
              </select>
            </div>
            {formData.遠隔高速利用 === '有' && (
              <div>
                <label className={labelClass}>伝票番号（有の場合）</label>
                <input type="text" name="伝票番号" value={formData.伝票番号} onChange={handleInputChange} placeholder="1234-5678" className={inputBaseClass} />
              </div>
            )}
          </div>
        </div>

        {/* 05 ステータス・メモ */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#eaaa43] flex items-center gap-1.5">
              <span className="text-base">📢</span> ステータス
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">05</div>
          </div>

          <div className={selectArrowClass}>
            <label className={labelClass}>現在のステータス</label>
            <select name="ステータス" value={formData.ステータス} onChange={handleInputChange} className={inputBaseClass}>
              <option value="完了">完了</option><option value="見積提出済">見積提出済</option><option value="部品待ち">部品待ち</option><option value="継続中">継続中</option>
            </select>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className={labelClass}>社内用メモ</label>
            <textarea name="社内用メモ" value={formData.社内用メモ} onChange={handleInputChange} placeholder="追加情報あれば入力ください。" rows={3} className={`${inputBaseClass} resize-none`} />
          </div>
        </div>

        {/* 提出ボタン */}
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
    </div>
  );
}
