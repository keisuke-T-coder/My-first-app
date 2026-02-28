"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// GASのURL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyi3gbullz4u0EqXBkhMVxiqfZq0-PKdhim9QVrSyl1q4SvBaS46GX5lzsyZrAu5j8u2A/exec';

// --- データ取得＆表示コンポーネント ---
function ReportList() {
  const searchParams = useSearchParams();
  const worker = searchParams.get('worker') || ""; 

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // GASから本日のデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // GETリクエストで担当者と「当日(today)」を指定して取得
        const res = await fetch(`${GAS_URL}?type=today&worker=${encodeURIComponent(worker)}`);
        if (!res.ok) throw new Error("通信エラー");
        const json = await res.json();
        
        // 新しい時間が上に来るように並び替え（降順）
        const sortedData = json.sort((a: any, b: any) => {
          if (!a.開始時間 || !b.開始時間) return 0;
          return a.開始時間 > b.開始時間 ? -1 : 1;
        });
        
        setData(sortedData);
      } catch (err) {
        setError("データの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [worker]);

  // サマリー計算
  const totalCount = data.length;
  const totalTech = data.reduce((sum, item) => sum + (Number(item.技術料) || 0), 0);
  const totalRepair = data.reduce((sum, item) => sum + (Number(item.修理金額) || 0), 0);
  const totalSales = data.reduce((sum, item) => sum + (Number(item.販売金額) || 0), 0);

  const todayStr = new Date().toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' });

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* 画面上部エリア */}
      <div className="w-[92%] max-w-md mt-6 mb-4">
        <div className="bg-[#eaaa43] rounded-[14px] py-4 px-4 shadow-sm flex items-center justify-between">
          <Link href="/" className="text-white font-bold flex items-center w-16 active:scale-90 transition-transform">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-sm tracking-wider">戻る</span>
          </Link>
          <h1 className="text-white font-bold tracking-widest text-lg flex-1 text-center">当日一覧</h1>
          <div className="w-16 flex justify-end">
            <div className="bg-white/20 px-3 py-1 rounded-full border border-white/30 text-white text-xs font-bold shadow-inner whitespace-nowrap">
              {worker || "全員"}
            </div>
          </div>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="w-[92%] max-w-md bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-4 mb-4">
        <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
          <div className="text-gray-500 font-bold text-sm">📅 {todayStr} の実績</div>
          <div className="text-[#eaaa43] font-black text-lg">{totalCount}<span className="text-xs ml-1 font-bold text-gray-400">件</span></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded-lg py-2">
            <div className="text-[10px] text-gray-400 font-bold mb-0.5">技術料</div>
            <div className="text-xs font-black text-gray-800">¥{totalTech.toLocaleString()}</div>
          </div>
          <div className="bg-[#547b97]/5 rounded-lg py-2">
            <div className="text-[10px] text-[#547b97] font-bold mb-0.5">修理合計</div>
            <div className="text-xs font-black text-[#547b97]">¥{totalRepair.toLocaleString()}</div>
          </div>
          <div className="bg-[#d98c77]/5 rounded-lg py-2">
            <div className="text-[10px] text-[#d98c77] font-bold mb-0.5">販売合計</div>
            <div className="text-xs font-black text-[#d98c77]">¥{totalSales.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* タイムライン（リスト） */}
      <div className="w-[92%] max-w-md flex flex-col gap-3">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400 font-bold text-sm animate-pulse">データを読み込んでいます...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 font-bold text-sm">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[16px] shadow-sm border border-dashed border-gray-200">
            <span className="text-4xl mb-3 block opacity-50">📭</span>
            <p className="text-gray-400 font-bold text-sm">本日の日報はまだありません</p>
          </div>
        ) : (
          data.map((item, index) => {
            // ★ 条件判定
            const isContracted = item.メモ && item.メモ.includes('成約');
            const isHighway = item.遠隔高速利用 === '有';

            return (
              // ★ 成約時の虹色グラデーション枠
              <div key={index} className={`rounded-[14px] shadow-sm relative p-[3px] ${isContracted ? 'bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500' : 'bg-transparent'}`}>
                
                {/* ★ 遠隔高速利用時は青色背景、それ以外は白背景 */}
                <div className={`rounded-[11px] p-3 w-full h-full relative overflow-hidden flex flex-col gap-1.5 ${isHighway ? 'bg-[#1e40af] text-white border-none' : 'bg-white border border-gray-100 text-gray-800'} ${isContracted && !isHighway ? 'bg-white' : ''}`}>
                  
                  {/* ★ 遠隔高速時の巨大な透かし車アイコン */}
                  {isHighway && (
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none flex flex-col items-center justify-center transform -rotate-12">
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      </svg>
                      <span className="font-black text-2xl tracking-widest mt-[-10px]">遠隔高速</span>
                    </div>
                  )}

                  {/* 行1: 時間とクライアント・訪問先 */}
                  <div className="flex justify-between items-center text-xs font-bold relative z-10">
                    <span className={`px-2 py-0.5 rounded-md ${isHighway ? 'bg-white/20' : 'bg-gray-100'}`}>
                      {item.開始時間} - {item.終了時間}
                    </span>
                    <span className="truncate ml-2 text-right flex-1 text-[13px]">
                      {item.クライアント && item.クライアント !== '(-----)' ? `${item.クライアント}：` : ''}{item.訪問先}
                    </span>
                  </div>

                  {/* 行2: 業務内容（コンパクトに1行で表示） */}
                  <div className={`text-[10px] truncate font-medium relative z-10 ${isHighway ? 'text-blue-100' : 'text-gray-500'}`}>
                    {item.エリア} / {item.品目} / {item.依頼内容} / {item.作業内容}
                  </div>

                  {/* 行3: 金額（横並びでスッキリと） */}
                  <div className="flex justify-between items-end mt-1 relative z-10">
                    <div className="text-[10px] font-bold">
                      {isContracted && <span className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-1.5 py-0.5 rounded mr-2">成約</span>}
                    </div>
                    <div className="flex gap-3 text-[11px] font-black">
                      <span>技: ¥{Number(item.技術料).toLocaleString()}</span>
                      {item.作業区分 === '修理' && (
                        <span className={isHighway ? 'text-blue-200' : 'text-[#547b97]'}>修: ¥{Number(item.修理金額).toLocaleString()}</span>
                      )}
                      {item.作業区分 === '販売' && (
                        <span className={isHighway ? 'text-pink-300' : 'text-[#d98c77]'}>販: ¥{Number(item.販売金額).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// --- メインページ（Suspenseでラップしてエクスポート） ---
export default function ReportListPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f0] font-sans text-slate-800 pb-32">
      <Suspense fallback={<div className="flex justify-center items-center h-screen text-gray-500 font-bold">画面を読み込んでいます...</div>}>
        <ReportList />
      </Suspense>

      {/* 画面下のタブバー（A-0と同じくリンクを構築） */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-[30px] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] h-[70px] flex justify-around items-center px-4 max-w-md mx-auto pb-2 z-40">
        <Link href="/" className="p-2 cursor-pointer relative">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
        <div className="p-2 cursor-pointer relative">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
        <div className="p-2 cursor-pointer relative">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#eaaa43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#eaaa43] rounded-full border-2 border-white"></span>
        </div>
        <div className="p-2 cursor-pointer relative">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
      </div>
    </div>
  );
}
