"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewReport() {
  // === 状態管理（フォームの入力値や切り替え状態） ===
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // トグルスイッチの状態
  const [billingType, setBillingType] = useState<'repair' | 'sales'>('repair'); // 修理 or 販売
  const [hasProposal, setHasProposal] = useState(false); // 提案の有無
  const [proposalItem, setProposalItem] = useState(""); // 提案内容（プルダウン）
  const [hasTollFee, setHasTollFee] = useState(false); // 遠隔・高速利用の有無

  // 今日の日付をデフォルトでセット
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // 開始時間が入力されたら、自動で30分後を終了時間にセットする魔法の関数
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartTime(newStart);
    if (newStart) {
      const [hours, minutes] = newStart.split(':').map(Number);
      const d = new Date();
      d.setHours(hours, minutes + 30); // 30分足す
      const endH = String(d.getHours()).padStart(2, '0');
      const endM = String(d.getMinutes()).padStart(2, '0');
      setEndTime(`${endH}:${endM}`);
    }
  };

  // 共通の入力欄デザイン（統一感を出すためのクラス）
  const inputBaseClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#eaaa43] focus:ring-2 focus:ring-[#eaaa43]/20 transition-all font-medium appearance-none";
  const labelClass = "block text-xs font-bold text-gray-500 mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center font-sans pb-32 relative overflow-x-hidden text-slate-800">
      
      {/* 画面上部エリア（固定ヘッダーではなく一緒にスクロールします） */}
      <div className="w-[92%] max-w-md mt-6 mb-6">
        <div className="bg-[#eaaa43] rounded-[14px] py-4 px-4 shadow-sm flex items-center justify-between">
          <Link href="/report" className="text-white font-bold flex items-center w-16 active:scale-90 transition-transform">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-sm tracking-wider">戻る</span>
          </Link>
          <h1 className="text-white font-bold tracking-widest text-lg flex-1 text-center">新規入力</h1>
          <div className="w-16 text-right">
            <span className="text-white/80 text-xs font-bold bg-white/20 px-2 py-1 rounded-md">南</span>
          </div>
        </div>
      </div>

      <div className="w-[92%] max-w-md flex flex-col gap-5">

        {/* =========================================
            [01] 基本情報
        ========================================= */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5">
          <h2 className="text-[#eaaa43] font-black text-sm tracking-widest mb-4 border-b border-gray-100 pb-2">01 基本情報</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>日付</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputBaseClass} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass}>開始時間</label>
                <input type="time" value={startTime} onChange={handleStartTimeChange} className={inputBaseClass} />
              </div>
              <div className="flex-1">
                <label className={labelClass}>終了時間</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={`${inputBaseClass} ${startTime && !endTime ? 'ring-2 ring-orange-200' : ''}`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>担当者</label>
              <div className="relative">
                <select className={`${inputBaseClass} pr-8`} defaultValue="minami">
                  <option value="">選択してください</option>
                  <option value="sato">佐藤</option>
                  <option value="tanaka">田中</option>
                  <option value="minami">南</option>
                  <option value="nitta">新田</option>
                  <option value="tokushige">德重</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>訪問先 (お客様名など)</label>
              <input type="text" placeholder="例：山田 太郎 様" className={inputBaseClass} />
            </div>
            <div>
              <label className={labelClass}>エリア</label>
              <div className="relative">
                <select className={`${inputBaseClass} pr-8`} defaultValue="">
                  <option value="">選択してください</option>
                  <option value="市内南部">市内南部エリア</option>
                  <option value="市街地">市街地エリア</option>
                  <option value="市内北部">市内北部エリア</option>
                  <option value="日置">日置エリア</option>
                  <option value="北薩">北薩エリア</option>
                  <option value="南薩">南薩エリア</option>
                  <option value="大隅">大隅エリア</option>
                  <option value="鹿屋">鹿屋エリア</option>
                  <option value="姶良">姶良エリア</option>
                  <option value="霧島">霧島エリア</option>
                  <option value="その他">その他</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            [02] 業務詳細
        ========================================= */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5">
          <h2 className="text-[#eaaa43] font-black text-sm tracking-widest mb-4 border-b border-gray-100 pb-2">02 業務詳細</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>クライアント (※任意)</label>
              <div className="relative">
                <select className={`${inputBaseClass} pr-8`} defaultValue="">
                  <option value="">未選択</option>
                  <option value="リビング">リビング</option>
                  <option value="ハウス">ハウス</option>
                  <option value="ひだまり">ひだまり</option>
                  <option value="タカギ">タカギ</option>
                  <option value="トータルサービス">トータルサービス</option>
                  <option value="lts">LTS</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>品目</label>
              <div className="relative">
                <select className={`${inputBaseClass} pr-8`} defaultValue="">
                  <option value="">選択してください</option>
                  <option value="トイレ">トイレ</option>
                  <option value="キッチン">キッチン</option>
                  <option value="洗面">洗面</option>
                  <option value="浴室">浴室</option>
                  <option value="ドア">ドア</option>
                  <option value="窓サッシ">窓サッシ</option>
                  <option value="水栓">水栓</option>
                  <option value="エクステリア">エクステリア</option>
                  <option value="照明換気設備">照明換気設備</option>
                  <option value="内装設備">内装設備</option>
                  <option value="外装設備">外装設備</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>依頼内容</label>
              <div className="relative">
                <select className={`${inputBaseClass} pr-8`} defaultValue="">
                  <option value="">選択してください</option>
                  <option value="水漏れ">水漏れ</option>
                  <option value="作動不良">作動(点灯)不良</option>
                  <option value="破損">破損</option>
                  <option value="異音">異音</option>
                  <option value="詰り関係">詰り関係</option>
                  <option value="その他">その他</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>作業内容</label>
              <div className="relative">
                <select className={`${inputBaseClass} pr-8`} defaultValue="">
                  <option value="">選択してください</option>
                  <option value="部品交換">部品交換</option>
                  <option value="製品交換取付">製品交換、取付</option>
                  <option value="清掃">清掃</option>
                  <option value="点検">点検</option>
                  <option value="見積">見積</option>
                  <option value="応急処置">応急処置</option>
                  <option value="その他">その他</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            [03] 金額
        ========================================= */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-[#eaaa43] font-black text-sm tracking-widest">03 金額</h2>
            {/* カプセル型トグルスイッチ */}
            <div className="flex bg-gray-100 rounded-full p-1 w-32">
              <button type="button" onClick={() => setBillingType('repair')} className={`flex-1 py-1 text-[10px] font-bold rounded-full transition-all ${billingType === 'repair' ? 'bg-white text-[#547b97] shadow-sm' : 'text-gray-400'}`}>修理</button>
              <button type="button" onClick={() => setBillingType('sales')} className={`flex-1 py-1 text-[10px] font-bold rounded-full transition-all ${billingType === 'sales' ? 'bg-white text-[#d98c77] shadow-sm' : 'text-gray-400'}`}>販売</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="w-20 text-xs font-bold text-gray-500 text-right">技術料</label>
              <div className="flex-1 relative">
                <input type="number" placeholder="0" className={`${inputBaseClass} text-right pr-8 font-black text-lg`} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">円</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className={`w-20 text-xs font-bold text-right transition-colors ${billingType === 'repair' ? 'text-[#547b97]' : 'text-[#d98c77]'}`}>
                {billingType === 'repair' ? '修理金額' : '販売金額'}
              </label>
              <div className="flex-1 relative">
                <input type="number" placeholder="0" className={`${inputBaseClass} text-right pr-8 font-black text-lg ${billingType === 'repair' ? 'focus:border-[#547b97] focus:ring-[#547b97]/20' : 'focus:border-[#d98c77] focus:ring-[#d98c77]/20'}`} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">円</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            [04] 提案
        ========================================= */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[#eaaa43] font-black text-sm tracking-widest">04 提案</h2>
            <div className="flex bg-gray-100 rounded-full p-1 w-24">
              <button type="button" onClick={() => setHasProposal(false)} className={`flex-1 py-1 text-[10px] font-bold rounded-full transition-all ${!hasProposal ? 'bg-white text-gray-600 shadow-sm' : 'text-gray-400'}`}>無</button>
              <button type="button" onClick={() => setHasProposal(true)} className={`flex-1 py-1 text-[10px] font-bold rounded-full transition-all ${hasProposal ? 'bg-[#eaaa43] text-white shadow-sm' : 'text-gray-400'}`}>有</button>
            </div>
          </div>
          
          {/* 「有」を選んだ時にアニメーションで展開 */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hasProposal ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 m-0'}`}>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>提案内容</label>
                <div className="relative">
                  <select value={proposalItem} onChange={(e) => setProposalItem(e.target.value)} className={`${inputBaseClass} pr-8 bg-orange-50/50 border-orange-100`}>
                    <option value="">選択してください</option>
                    <option value="サティス">サティス</option>
                    <option value="プレアス">プレアス</option>
                    <option value="アメージュ">アメージュ</option>
                    <option value="パッソ">パッソ</option>
                    <option value="KA">KA</option>
                    <option value="KB">KB</option>
                    <option value="水栓">水栓</option>
                    <option value="その他">その他</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-orange-300 pointer-events-none">▼</span>
                </div>
              </div>
              {/* 「その他」を選んだ時に展開 */}
              {proposalItem === "その他" && (
                <div className="animate-fade-in">
                  <input type="text" placeholder="提案内容を入力してください" className={inputBaseClass} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            [05] ステータス
        ========================================= */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5">
          <h2 className="text-[#eaaa43] font-black text-sm tracking-widest mb-4 border-b border-gray-100 pb-2">05 ステータス</h2>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>状況</label>
              <div className="relative">
                <select className={`${inputBaseClass} pr-8`} defaultValue="完了">
                  <option value="完了">完了</option>
                  <option value="再訪予定">再訪予定</option>
                  <option value="部品手配">部品手配</option>
                  <option value="見積">見積</option>
                  <option value="保留">保留</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-600 flex items-center">
                  <span className="text-base mr-1">🚗</span>遠隔、高速利用
                </label>
                <div className="flex bg-gray-200 rounded-full p-1 w-24">
                  <button type="button" onClick={() => setHasTollFee(false)} className={`flex-1 py-1 text-[10px] font-bold rounded-full transition-all ${!hasTollFee ? 'bg-white text-gray-600 shadow-sm' : 'text-gray-400'}`}>無</button>
                  <button type="button" onClick={() => setHasTollFee(true)} className={`flex-1 py-1 text-[10px] font-bold rounded-full transition-all ${hasTollFee ? 'bg-[#eaaa43] text-white shadow-sm' : 'text-gray-400'}`}>有</button>
                </div>
              </div>
              
              {/* 「有」を選んだ時に展開 */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hasTollFee ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0 m-0'}`}>
                <input type="text" placeholder="伝票番号を入力してください" className={`${inputBaseClass} border-orange-200 focus:border-[#eaaa43]`} />
              </div>
            </div>

            <div>
              <label className={labelClass}>メモ</label>
              <textarea placeholder="現場の状況や申し送り事項を入力..." className={`${inputBaseClass} h-28 resize-none`}></textarea>
            </div>
          </div>
        </div>

        {/* =========================================
            提出ボタン
        ========================================= */}
        <div className="mt-2 mb-8">
          <button className="w-full bg-[#eaaa43] text-white font-black text-lg py-4 rounded-full shadow-[0_4px_15px_rgba(234,170,67,0.3)] active:scale-95 active:shadow-sm transition-all flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            内容確認する
          </button>
        </div>

      </div>

      {/* 画面下のタブバー */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-[30px] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] h-[70px] flex justify-around items-center px-4 max-w-md mx-auto pb-2 z-50">
        <Link href="/" className="p-2 cursor-pointer relative z-50">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
        <div className="p-2 cursor-pointer relative z-50">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
        <div className="p-2 cursor-pointer relative z-50">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#eaaa43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#eaaa43] rounded-full border-2 border-white"></span>
        </div>
        <div className="p-2 cursor-pointer relative z-50">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
      </div>

    </div>
  );
}
