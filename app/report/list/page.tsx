"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// GASのURL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyi3gbullz4u0EqXBkhMVxiqfZq0-PKdhim9QVrSyl1q4SvBaS46GX5lzsyZrAu5j8u2A/exec';

// --- 時間の文字列を綺麗に整形する関数 ---
const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  if (timeStr.includes("T")) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    }
  }
  return timeStr;
};

// --- データ取得＆表示コンポーネント ---
function ReportList() {
  const searchParams = useSearchParams();
  const worker = searchParams.get('worker') || ""; 

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // タップで開くための状態管理
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // GASから本日のデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${GAS_URL}?type=today&worker=${encodeURIComponent(worker)}`);
        if (!res.ok) throw new Error("通信エラー");
        const json = await res.json();
        
        // 新しい時間が上に来るように並び替え
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
          <Link href="/report" className="text-white font-bold flex items-center w-16 active:scale-90 transition-transform">
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
            const isContracted = item.メモ && item.メモ.includes('成約');
            const isHighway = item.遠隔高速利用 === '有';
            const isExpanded = expandedIndex === index;

            return (
              <div 
                key={index} 
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className={`rounded-[14px] shadow-sm relative cursor-pointer transition-all duration-300 ${isContracted ? 'p-[3px] bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400' : 'p-0 bg-transparent'}`}
              >
                
                <div className={`rounded-[11px] p-3.5 w-full relative overflow-hidden flex flex-col gap-1.5 ${isHighway ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'} ${isContracted && !isHighway ? 'border-none' : 'border'}`}>
                  
                  {/* 車のアイコン透かし */}
                  {isHighway && (
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center transform -rotate-12 opacity-40 text-blue-400">
                      <svg width="110" height="110" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      </svg>
                    </div>
                  )}

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${isHighway ? 'bg-white/60 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        {formatTime(item.開始時間)} - {formatTime(item.終了時間)}
                      </span>
                    </div>
                    
                    <div className="text-gray-400">
                      {isExpanded ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="text-[13px] font-black text-gray-800 truncate">
                      {item.クライアント && item.クライアント !== '(-----)' ? <span className="text-[10px] text-gray-500 mr-1 bg-gray-100 px-1.5 py-0.5 rounded">{item.クライアント}</span> : ''}
                      {item.訪問先}
                    </div>
                    <div className={`text-[10px] truncate font-bold mt-0.5 ${isHighway ? 'text-blue-600/80' : 'text-gray-400'}`}>
                      {item.エリア} / {item.品目} / {item.作業内容}
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-1 relative z-10">
                    <div className="flex gap-1.5 flex-wrap">
                      {isContracted && <span className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">成約</span>}
                      {isHighway && <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm border border-blue-400">遠隔・高速利用: {item.伝票番号}</span>}
                    </div>
                    <div className="flex gap-2.5 text-[11px] font-black">
                      <span className="text-gray-600">技:¥{Number(item.技術料).toLocaleString()}</span>
                      {item.作業区分 === '修理' && (
                        <span className={isHighway ? 'text-blue-700' : 'text-[#547b97]'}>修:¥{Number(item.修理金額).toLocaleString()}</span>
                      )}
                      {item.作業区分 === '販売' && (
                        <span className={isHighway ? 'text-pink-600' : 'text-[#d98c77]'}>販:¥{Number(item.販売金額).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* タップして開く詳細エリア */}
                  {isExpanded && (
                    <div className={`mt-3 pt-3 border-t ${isHighway ? 'border-blue-200' : 'border-gray-100'} text-[11px] space-y-2 animate-fade-in relative z-10`}>
                      {/* ★ 追加：依頼内容 */}
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-bold">依頼内容</span>
                        <span className="font-black text-gray-700">{item.依頼内容}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-bold">状況</span>
                        <span className={`font-black px-2 py-0.5 rounded ${item.状況 === '完了' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{item.状況}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-bold">提案</span>
                        <span className="font-black text-gray-700">{item.提案有無} {item.提案内容 ? `(${item.提案内容})` : ''}</span>
                      </div>
                      {item.メモ && (
                        <div>
                          <span className="text-gray-500 font-bold block mb-1">メモ</span>
                          <div className={`p-2.5 rounded-lg ${isHighway ? 'bg-white/60' : 'bg-gray-50'} text-gray-700 font-medium whitespace-pre-wrap leading-relaxed`}>
                            {item.メモ}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

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

      {/* 画面下のタブバー */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-[30px] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] h-[70px] flex justify-around items-center px-4 max-w-md mx-auto pb-2 z-40">
        <Link href="/report" className="p-2 cursor-pointer relative">
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
