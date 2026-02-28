"use client";

import React from 'react';
import Link from 'next/link';

export default function ReportList() {
  // === モックアップ用のダミーデータ（今日提出された日報のリスト） ===
  const todayReports = [
    {
      id: 1,
      time: "09:00",
      clientName: "山田 太郎 様",
      item: "トイレ",
      work: "部品交換",
      techFee: 5000,
      repair: 15000,
      sales: 0,
      isToll: false,
      tollNumber: ""
    },
    {
      id: 2,
      time: "11:00",
      clientName: "リビング(〇〇M)",
      item: "水栓",
      work: "製品交換",
      techFee: 8000,
      repair: 0,
      sales: 25000,
      isToll: true,
      tollNumber: "9876-5432-10" // 高速・遠隔あり
    },
    {
      id: 3,
      time: "13:30",
      clientName: "佐藤 花子 様",
      item: "窓サッシ",
      work: "清掃",
      techFee: 3000,
      repair: 0,
      sales: 0,
      isToll: false,
      tollNumber: ""
    },
    {
      id: 4,
      time: "14:30",
      clientName: "タカギ(△△ハイツ)",
      item: "浴室",
      work: "点検",
      techFee: 5000,
      repair: 0,
      sales: 0,
      isToll: true,
      tollNumber: "1122-3344-55" // 高速・遠隔あり
    },
    {
      id: 5,
      time: "16:00",
      clientName: "鈴木 一郎 様",
      item: "キッチン",
      work: "応急処置",
      techFee: 5000,
      repair: 0,
      sales: 0,
      isToll: false,
      tollNumber: ""
    },
    {
      id: 6,
      time: "17:30",
      clientName: "ひだまり",
      item: "トイレ",
      work: "見積",
      techFee: 0,
      repair: 0,
      sales: 0,
      isToll: false,
      tollNumber: ""
    }
  ];

  // サマリー用の合計計算
  const totalTechFee = todayReports.reduce((sum, report) => sum + report.techFee, 0);
  const totalSales = todayReports.reduce((sum, report) => sum + report.sales, 0);

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center font-sans pb-32 relative overflow-x-hidden text-slate-800">
      
      {/* --- 画面上部ヘッダー --- */}
      <div className="w-[92%] max-w-md mt-6 mb-4">
        <div className="bg-[#eaaa43] rounded-[14px] py-3 px-4 shadow-sm flex items-center justify-between">
          <Link href="/report" className="text-white font-bold flex items-center w-16 active:scale-90 transition-transform">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-sm tracking-wider">戻る</span>
          </Link>
          <h1 className="text-white font-bold tracking-widest text-base flex-1 text-center">当日一覧</h1>
          <div className="w-16 text-right">
            <span className="text-white/80 text-[10px] font-bold bg-white/20 px-2 py-1 rounded-md">南</span>
          </div>
        </div>
      </div>

      {/* --- サマリーエリア（極限までスリムに） --- */}
      <div className="w-[92%] max-w-md mb-3">
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-2 flex items-center justify-between text-xs">
          <div className="font-bold text-gray-500">
            本日: <span className="text-gray-800 text-sm">{todayReports.length}</span> 件
          </div>
          <div className="flex gap-4 font-black">
            <div className="text-gray-700">
              技: <span className="text-sm tracking-tight">¥{totalTechFee.toLocaleString()}</span>
            </div>
            {/* 販売金額はオレンジ/赤系で強調 */}
            <div className="text-[#d98c77]">
              販: <span className="text-sm tracking-tight">¥{totalSales.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- リストエリア（カードが並ぶ部分） --- */}
      <div className="w-[92%] max-w-md flex flex-col gap-2">
        {todayReports.map((report) => (
          <div 
            key={report.id} 
            // 遠隔・高速利用(isToll)が true の場合は背景を青っぽくし、枠線を青にする
            className={`rounded-xl p-2.5 shadow-sm border ${
              report.isToll 
                ? 'bg-[#f0f7ff] border-[#cce0ff]' 
                : 'bg-white border-transparent'
            }`}
          >
            {/* 上段：時間・訪問先・内容 */}
            <div className="flex justify-between items-center mb-1.5">
              <div className="font-black text-xs text-gray-800 truncate pr-2 flex items-center">
                <span className="text-gray-500 mr-1.5 font-bold">[{report.time}]</span>
                <span className="truncate">{report.clientName}</span>
              </div>
              <div className="text-[10px] text-gray-500 font-bold whitespace-nowrap bg-white/60 px-1.5 py-0.5 rounded">
                ({report.item} / {report.work})
              </div>
            </div>

            {/* 中段：遠隔・高速ありの場合のみ表示される伝票番号エリア */}
            {report.isToll && (
              <div className="bg-blue-100/50 rounded py-1 px-2 mb-1.5 flex items-center text-[11px]">
                <span className="text-sm mr-1.5">🚗</span>
                <span className="text-[#3b82f6] font-bold mr-2">伝票番号:</span>
                {/* 伝票番号を太字で強調 */}
                <span className="text-gray-900 font-black tracking-widest">{report.tollNumber}</span>
              </div>
            )}

            {/* 下段：お金の集計（境界線で区切る） */}
            <div className={`flex justify-between items-center pt-1.5 border-t text-[10px] font-bold ${report.isToll ? 'border-[#cce0ff]' : 'border-gray-100'}`}>
              <div className="flex-1 text-gray-600">
                技: <span className="text-gray-800">¥{report.techFee.toLocaleString()}</span>
              </div>
              <div className="text-gray-300 mx-1">|</div>
              <div className="flex-1 text-center text-[#547b97]">
                修: <span className="text-[#547b97]">¥{report.repair.toLocaleString()}</span>
              </div>
              <div className="text-gray-300 mx-1">|</div>
              <div className={`flex-1 text-right ${report.sales > 0 ? 'text-[#d98c77]' : 'text-gray-400'}`}>
                販: <span className={report.sales > 0 ? 'text-[#d98c77]' : 'text-gray-400'}>¥{report.sales.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- 画面下のタブバー --- */}
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
