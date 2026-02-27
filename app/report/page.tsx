"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReportMenu() {
  // === 状態管理（モックアップ用のアニメーション・切り替えスイッチ） ===
  const [assignee, setAssignee] = useState(""); // 担当者
  
  // A-5: お知らせ機能の状態
  const [isNoticeEditMode, setIsNoticeEditMode] = useState(false);
  const [isNoticeActive, setIsNoticeActive] = useState(true);
  const [noticeText, setNoticeText] = useState("【重要】25日は経費の締め日です。忘れずに申請をお願いします。");
  const [draftNoticeText, setDraftNoticeText] = useState(noticeText);

  // A-5: 集計テーブルの状態
  const [summaryPeriod, setSummaryPeriod] = useState<'day' | 'month' | 'year'>('month');

  // モックアップ用のダミーデータ（期間ごとの数値）
  const mockData = {
    day: { tech: 15000, repair: 25000, sales: 0 },
    month: { tech: 450000, repair: 600000, sales: 200000 },
    year: { tech: 5400000, repair: 7200000, sales: 2400000 }
  };
  const currentData = mockData[summaryPeriod];
  const totalRev = currentData.repair + currentData.sales;
  const repairPercent = totalRev === 0 ? 0 : Math.round((currentData.repair / totalRev) * 100);
  const salesPercent = totalRev === 0 ? 0 : Math.round((currentData.sales / totalRev) * 100);

  // お知らせ保存処理
  const handleSaveNotice = () => {
    setNoticeText(draftNoticeText);
    setIsNoticeEditMode(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center font-sans pb-32 relative overflow-x-hidden text-slate-800">
      
      {/* 画面上部エリア */}
      <div className="w-[92%] max-w-md mt-6 mb-6">
        {/* オレンジヘッダー */}
        <div className="bg-[#eaaa43] rounded-[14px] py-4 px-4 shadow-sm flex items-center justify-between">
          <Link href="/" className="text-white font-bold flex items-center w-16 active:scale-90 transition-transform">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-sm tracking-wider">戻る</span>
          </Link>
          <h1 className="text-white font-bold tracking-widest text-lg flex-1 text-center">日報入力</h1>
          <div className="w-16"></div>
        </div>

        {/* 担当者選択 */}
        <div className="mt-5 flex justify-end">
          <div className="bg-white border border-gray-100 rounded-full px-5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center relative w-[160px]">
            <select 
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="bg-transparent font-black text-slate-800 outline-none appearance-none cursor-pointer w-full text-sm z-10 text-center"
            >
              <option value="">担当者選択</option>
              <option value="sato">佐藤</option>
              <option value="tanaka">田中</option>
              <option value="minami">南</option>
              <option value="nitta">新田</option>
              <option value="tokushige">德重</option>
              <option value="add">＋ 追加 (Add)</option>
            </select>
            <span className="text-[10px] text-gray-400 pointer-events-none absolute right-4">▼</span>
          </div>
        </div>
      </div>

      {/* A-1〜A-4 メニューカード一覧 */}
      <div className="grid grid-cols-2 gap-4 w-[92%] max-w-md mb-8">
        <Link href="/report/new" className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100">
          <h2 className="text-[1.2rem] font-black text-gray-900 tracking-widest mb-1">新規入力</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3">A-1</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </Link>
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <h2 className="text-[1.2rem] font-black text-gray-900 tracking-widest mb-1">当日一覧</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3">A-2</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </div>
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <h2 className="text-[1.2rem] font-black text-gray-900 tracking-widest mb-1">過去履歴</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3">A-3</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </div>
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <h2 className="text-[1.1rem] font-black text-gray-900 tracking-widest mb-1 leading-tight text-center">高速代<br/>遠隔地</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3 mt-1">A-4</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </div>
      </div>

      {/* =========================================
          A-5: ダッシュボードエリア（お知らせ・スローガン・集計）
      ========================================= */}
      <div className="w-[92%] max-w-md flex flex-col gap-6">
        
        {/* ② お知らせエリア（優先表示＆設定機能） */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#eaaa43] font-bold text-sm tracking-widest flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              お知らせ設定
            </h3>
            {/* 編集モード切り替えボタン */}
            <button onClick={() => setIsNoticeEditMode(!isNoticeEditMode)} className="text-gray-400 hover:text-[#eaaa43] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </div>

          {/* 編集モード */}
          {isNoticeEditMode ? (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">通知オン（優先表示）</span>
                {/* トグルスイッチ */}
                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isNoticeActive ? 'bg-[#eaaa43]' : 'bg-gray-300'}`} onClick={() => setIsNoticeActive(!isNoticeActive)}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isNoticeActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
              {isNoticeActive && (
                <textarea 
                  value={draftNoticeText}
                  onChange={(e) => setDraftNoticeText(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-lg outline-none focus:border-[#eaaa43] resize-none h-24 mb-3"
                  placeholder="お知らせ内容を入力..."
                />
              )}
              <button onClick={handleSaveNotice} className="w-full bg-[#eaaa43] text-white font-bold py-2 rounded-lg active:scale-95 transition-transform">
                お知らせを更新
              </button>
            </div>
          ) : (
            /* 表示モード（オンの時だけ表示） */
            isNoticeActive ? (
              <div className="bg-orange-50 border-l-4 border-[#eaaa43] p-4 rounded-r-xl">
                <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">{noticeText}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">現在、優先表示されるお知らせはありません（通知オフ）</p>
            )
          )}
        </div>

        {/* ① 今期のスローガン（デフォルト表示） */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5">
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-gray-800 font-black text-base tracking-widest relative inline-block">
              たったできること
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-[#eaaa43] opacity-30 rounded-full"></div>
            </h3>
          </div>
          {/* 一回り小さめのグリッド */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-center text-center h-20">
              <p className="text-[11px] font-bold text-gray-700 leading-snug">リピート率向上<br/><span className="text-[9px] text-gray-500 font-medium">(名札着用必須・名刺活用)</span></p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-center text-center h-20">
              <p className="text-[11px] font-bold text-gray-700 leading-snug">緊急時の案内<br/><span className="text-[9px] text-gray-500 font-medium">(止水栓・水道メーター位置)</span></p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-center text-center h-20">
              <p className="text-[11px] font-bold text-gray-700 leading-snug">インターフォン越しの<br/>名札提示</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-center text-center h-20">
              <p className="text-[11px] font-bold text-gray-700 leading-snug">訪問前日在宅確認の徹底<br/><span className="text-[9px] text-gray-500 font-medium">(1週間以上経過時)</span></p>
            </div>
          </div>
        </div>

        {/* ③ 集計テーブル */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#eaaa43] font-bold text-sm tracking-widest">集計テーブル</h3>
            <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              対象: {assignee === "" ? "会社全体" : assignee === "sato" ? "佐藤" : assignee === "tanaka" ? "田中" : assignee === "minami" ? "南" : assignee === "nitta" ? "新田" : assignee === "tokushige" ? "德重" : "会社全体"}
            </span>
          </div>

          {/* 期間切り替えボタン */}
          <div className="flex gap-2 mb-5 bg-gray-50 p-1 rounded-lg">
            <button onClick={() => setSummaryPeriod('day')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${summaryPeriod === 'day' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>当日</button>
            <button onClick={() => setSummaryPeriod('month')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${summaryPeriod === 'month' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>当月</button>
            <button onClick={() => setSummaryPeriod('year')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${summaryPeriod === 'year' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>年</button>
          </div>

          {/* 数値テーブル */}
          <table className="w-full text-sm mb-5">
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">技術料</td>
                <td className="py-2.5 text-right font-black text-gray-800"><span className="text-xs text-gray-400 font-normal mr-1">¥</span>{currentData.tech.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-[#547b97] font-bold">修理合計</td>
                <td className="py-2.5 text-right font-black text-[#547b97]"><span className="text-xs font-normal mr-1">¥</span>{currentData.repair.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-[#d98c77] font-bold">販売金額</td>
                <td className="py-2.5 text-right font-black text-[#d98c77]"><span className="text-xs font-normal mr-1">¥</span>{currentData.sales.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* 構成比グラフ */}
          <div>
            <div className="flex justify-between text-[10px] font-bold mb-1">
              <span className="text-[#547b97]">修理 {repairPercent}%</span>
              <span className="text-gray-400 tracking-widest">売上構成比</span>
              <span className="text-[#d98c77]">販売 {salesPercent}%</span>
            </div>
            {/* バー */}
            <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-100">
              <div className="bg-[#547b97] transition-all duration-500" style={{ width: `${repairPercent}%` }}></div>
              <div className="bg-[#d98c77] transition-all duration-500" style={{ width: `${salesPercent}%` }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* 画面下のナビゲーションバー */}
      <div className="fixed bottom-0 w-full bg-white rounded-t-[30px] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] h-[70px] flex justify-around items-center px-4 max-w-md mx-auto pb-2 z-10">
        <Link href="/" className="p-2 cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
        <div className="p-2 cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
        <div className="p-2 cursor-pointer relative">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#eaaa43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#eaaa43] rounded-full border-2 border-white"></span>
        </div>
        <div className="p-2 cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
        <span className="absolute bottom-[6px] right-4 text-[10px] text-gray-400 italic">app version 1.0</span>
      </div>

    </div>
  );
}
