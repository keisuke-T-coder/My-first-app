"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// ★ 変更: URL制御のためのルーターを追加
import { useSearchParams, useRouter } from 'next/navigation';

// GASのURL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyi3gbullz4u0EqXBkhMVxiqfZq0-PKdhim9QVrSyl1q4SvBaS46GX5lzsyZrAu5j8u2A/exec';

const extractDateForInput = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return dateStr;
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URLのクエリパラメーターから、現在開いているモーダルの種類を取得
  const activeModal = searchParams.get('modal');

  // 担当者の初期値をローカルストレージから取得
  const [assignee, setAssignee] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedWorker') || "";
    }
    return "";
  });
  
  // === スワイプ・カルーセルの状態管理 ===
  const [activeIndex, setActiveIndex] = useState(1); 

  // === お知らせ機能の状態管理 ===
  const [isLoadingNotice, setIsLoadingNotice] = useState(true);
  const [isSavingNotice, setIsSavingNotice] = useState(false);
  const [isNoticeActive, setIsNoticeActive] = useState(false);
  const [isNoticeEditMode, setIsNoticeEditMode] = useState(false); 
  const [noticeText, setNoticeText] = useState("");
  const [draftNoticeText, setDraftNoticeText] = useState("");

  // === 集計テーブル用の状態 ===
  const [summaryPeriod, setSummaryPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [allReports, setAllReports] = useState<any[]>([]);
  const [isReportsLoading, setIsReportsLoading] = useState(false);

  // 1. お知らせをGASから取得
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`${GAS_URL}?type=notice`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        setIsNoticeActive(data.isActive);
        setNoticeText(data.text);
        setDraftNoticeText(data.text);
        
        if (data.isActive) {
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("お知らせの取得に失敗しました", error);
        setNoticeText("現在、お知らせはありません");
      } finally {
        setIsLoadingNotice(false);
      }
    };
    fetchNotice();
  }, []);

  // 2. 日報データをGASから取得
  useEffect(() => {
    const fetchReports = async () => {
      setIsReportsLoading(true);
      try {
        const workerParam = (assignee === "" || assignee === "add") ? "" : assignee;
        const res = await fetch(`${GAS_URL}?worker=${encodeURIComponent(workerParam)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAllReports(data);
      } catch (error) {
        console.error("日報データの取得に失敗しました", error);
      } finally {
        setIsReportsLoading(false);
      }
    };
    fetchReports();
  }, [assignee]);

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAssignee(val);
    localStorage.setItem('selectedWorker', val);
  };

  // スワイプ操作ロジック
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && activeIndex < 2) {
      setActiveIndex(prev => prev + 1);
    }
    if (distance < -minSwipeDistance && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  // お知らせ保存
  const handleSaveNotice = async () => {
    setIsSavingNotice(true);
    try {
      const payload = {
        action: 'updateNotice',
        isActive: isNoticeActive,
        text: draftNoticeText
      };
      const formBody = new URLSearchParams();
      formBody.append('data', JSON.stringify(payload));
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody,
      });

      setNoticeText(draftNoticeText);
      setIsNoticeEditMode(false);
      alert("設定を保存しました。\nこの内容は全スタッフのアプリに反映されます。");
    } catch (error) {
      alert("通信エラーが発生しました。");
    } finally {
      setIsSavingNotice(false);
    }
  };

  // ★ 追加: パネルをタップした時にURLパラメーターをつけてポップアップを開く
  const openModal = (modalName: string) => {
    router.push(`?modal=${modalName}`, { scroll: false });
  };

  // ★ 追加: ポップアップを閉じる（URLのパラメーターを消す）
  const closeModal = () => {
    router.push('/report', { scroll: false });
    setIsNoticeEditMode(false); // 編集モードもリセット
  };

  // 集計計算ロジック
  const d = new Date();
  const currentDay = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const currentYear = `${d.getFullYear()}`;

  let techSum = 0;
  let repairSum = 0;
  let salesSum = 0;

  allReports.forEach(item => {
    if (!item.日付) return;
    const cleanDate = extractDateForInput(item.日付);
    if (!cleanDate) return;
    
    let isMatch = false;
    if (summaryPeriod === 'day') isMatch = cleanDate === currentDay;
    else if (summaryPeriod === 'month') isMatch = cleanDate.startsWith(currentMonth);
    else if (summaryPeriod === 'year') isMatch = cleanDate.startsWith(currentYear);

    if (isMatch) {
      techSum += Number(item.技術料) || 0;
      repairSum += Number(item.修理金額) || 0;
      salesSum += Number(item.販売金額) || 0;
    }
  });

  const totalRev = repairSum + salesSum;
  const repairPercent = totalRev === 0 ? 0 : Math.round((repairSum / totalRev) * 100);
  const salesPercent = totalRev === 0 ? 0 : Math.round((salesSum / totalRev) * 100);

  const getQueryString = () => assignee && assignee !== "add" ? `?worker=${assignee}` : "";

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center font-sans pb-32 relative overflow-x-hidden text-slate-800">
      
      {/* 画面上部エリア */}
      <div className="w-[92%] max-w-md mt-6 mb-6">
        <div className="bg-[#eaaa43] rounded-[14px] py-4 px-4 shadow-sm flex items-center justify-between">
          <Link href="/" className="text-white font-bold flex items-center w-16 active:scale-90 transition-transform relative z-50">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-sm tracking-wider">戻る</span>
          </Link>
          <h1 className="text-white font-bold tracking-widest text-lg flex-1 text-center">日報入力</h1>
          <div className="w-16"></div>
        </div>

        {/* ★ 変更: 日報送信（A-5）ボタンと担当者選択を並べる */}
        <div className="mt-5 flex justify-between items-center gap-2">
          
          <Link href={`/report/submit${getQueryString()}`} className="bg-white border border-[#eaaa43] text-[#eaaa43] font-bold rounded-full px-4 py-2.5 shadow-sm active:scale-95 transition-transform flex items-center text-sm z-20 hover:bg-orange-50">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            日報送信
          </Link>

          <div className="bg-white border border-gray-100 rounded-full px-5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center relative w-[160px] z-20">
            <select 
              value={assignee}
              onChange={handleAssigneeChange}
              className="bg-transparent font-black text-slate-800 outline-none appearance-none cursor-pointer w-full text-sm z-10 text-center"
            >
              <option value="">担当者選択</option>
              <option value="佐藤">佐藤</option>
              <option value="田中">田中</option>
              <option value="南">南</option>
              <option value="新田">新田</option>
              <option value="德重">德重</option>
              <option value="add">＋ 追加 (Add)</option>
            </select>
            <span className="text-[10px] text-gray-400 pointer-events-none absolute right-4 z-0">▼</span>
          </div>
        </div>
      </div>

      {/* A-1〜A-4 メニューカード一覧 */}
      <div className="grid grid-cols-2 gap-4 w-[92%] max-w-md mb-8 z-20 relative">
        <Link href={`/report/new${getQueryString()}`} className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100">
          <h2 className="text-[1.2rem] font-black text-gray-900 tracking-widest mb-1">新規入力</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3">A-1</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </Link>
        <Link href={`/report/list${getQueryString()}`} className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <h2 className="text-[1.2rem] font-black text-gray-900 tracking-widest mb-1">当日一覧</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3">A-2</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </Link>
        <Link href={`/report/history${getQueryString()}`} className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <h2 className="text-[1.2rem] font-black text-gray-900 tracking-widest mb-1">過去履歴</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3">A-3</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </Link>
        <Link href={`/report/toll${getQueryString()}`} className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <h2 className="text-[1.1rem] font-black text-gray-900 tracking-widest mb-1 leading-tight text-center">高速代<br/>遠隔地</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-3 mt-1">A-4</p>
          <div className="w-[50%] max-w-[50px] h-[2px] bg-[#cba358]"></div>
        </Link>
      </div>

      {/* スワイプ式ダッシュボードエリア */}
      <div className="w-[92%] max-w-md mx-auto mb-6 z-20 relative">
        <div 
          className="overflow-hidden w-full pb-2"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300 ease-out w-[300%] items-stretch"
            style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}
          >
            
            {/* 0: お知らせ パネル（★変更: クリックでポップアップを開く） */}
            <div className="w-1/3 px-1.5 h-64">
              <div 
                onClick={() => openModal('notice')}
                className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 h-full flex flex-col relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              >
                {isLoadingNotice ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-bold animate-pulse">
                    情報を取得中...
                  </div>
                ) : (
                  <div className="flex flex-col h-full animate-fade-in relative pointer-events-none">
                    {/* 右上の歯車アイコン */}
                    <div className="absolute -top-1 -right-1 p-2 text-gray-300 z-10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    {isNoticeActive ? (
                      <div className="bg-[#fdf8f0] border-2 border-[#eaaa43] rounded-xl p-4 flex-1 flex flex-col justify-center items-center text-center shadow-[inset_0_0_15px_rgba(234,170,67,0.1)]">
                        <span className="text-3xl mb-2 block">📢</span>
                        <h4 className="text-[#eaaa43] font-black text-sm mb-2 tracking-widest border-b border-[#eaaa43] pb-1 inline-block">事務局よりお知らせ</h4>
                        <p className="text-xs text-gray-800 font-bold leading-relaxed whitespace-pre-wrap line-clamp-3">{noticeText}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 flex-1 flex flex-col justify-center items-center text-center">
                        <span className="text-3xl mb-2 block opacity-50">📭</span>
                        <p className="text-xs text-gray-400 font-medium">現在、全体へのお知らせはありません</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 1: たったできることパネル（★変更: クリックでポップアップを開く） */}
            <div className="w-1/3 px-1.5 h-64">
              <div 
                onClick={() => openModal('todo')}
                className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 h-full flex flex-col justify-center cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-center mb-5 pointer-events-none">
                  <h3 className="text-gray-800 font-black text-base tracking-widest relative inline-block">
                    たったできること
                    <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-[#eaaa43] opacity-30 rounded-full"></div>
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 pointer-events-none">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center justify-center text-center h-[80px]">
                    <p className="text-[11px] font-bold text-gray-700 leading-snug">リピート率向上<br/><span className="text-[9px] text-gray-500 font-medium block mt-1 scale-90">(名札着用必須・名刺活用)</span></p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center justify-center text-center h-[80px]">
                    <p className="text-[11px] font-bold text-gray-700 leading-snug">緊急時の案内<br/><span className="text-[9px] text-gray-500 font-medium block mt-1 scale-90">(止水栓・水道メーター)</span></p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center justify-center text-center h-[80px]">
                    <p className="text-[11px] font-bold text-gray-700 leading-snug">インターフォン<br/>越しの名札提示</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center justify-center text-center h-[80px]">
                    <p className="text-[11px] font-bold text-gray-700 leading-snug">訪問前日在宅確認<br/><span className="text-[9px] text-gray-500 font-medium block mt-1 scale-90">(1週間以上経過時)</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2: リアルタイム集計パネル（★変更: クリックでポップアップを開く。※内部のタブ切り替えは直接できるようにしておく） */}
            <div className="w-1/3 px-1.5 h-64">
              <div 
                onClick={(e) => {
                  // タブボタンを押した時はポップアップを開かない
                  if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                    openModal('summary');
                  }
                }}
                className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 h-full flex flex-col justify-center cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between mb-4 pointer-events-none">
                  <h3 className="text-[#eaaa43] font-bold text-sm tracking-widest">集計</h3>
                  <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                    {assignee === "" || assignee === "add" ? "会社全体" : assignee}
                  </span>
                </div>
                
                {isReportsLoading ? (
                  <div className="flex-1 flex justify-center items-center text-gray-400 text-xs font-bold animate-pulse pointer-events-none">
                    計算中...
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-4 bg-gray-50 p-1 rounded-lg">
                      <button onClick={() => setSummaryPeriod('day')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-colors ${summaryPeriod === 'day' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>当日</button>
                      <button onClick={() => setSummaryPeriod('month')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-colors ${summaryPeriod === 'month' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>当月</button>
                      <button onClick={() => setSummaryPeriod('year')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-colors ${summaryPeriod === 'year' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>年</button>
                    </div>
                    <table className="w-full text-xs mb-4 pointer-events-none">
                      <tbody>
                        <tr className="border-b border-gray-50">
                          <td className="py-2 text-gray-500 font-medium">技術料</td>
                          <td className="py-2 text-right font-black text-gray-800"><span className="text-[10px] text-gray-400 font-normal mr-1">¥</span>{techSum.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-50">
                          <td className="py-2 text-[#547b97] font-bold">修理合計</td>
                          <td className="py-2 text-right font-black text-[#547b97]"><span className="text-[10px] font-normal mr-1">¥</span>{repairSum.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-[#d98c77] font-bold">販売金額</td>
                          <td className="py-2 text-right font-black text-[#d98c77]"><span className="text-[10px] font-normal mr-1">¥</span>{salesSum.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="pointer-events-none">
                      <div className="flex justify-between text-[9px] font-bold mb-1">
                        <span className="text-[#547b97]">修理 {repairPercent}%</span>
                        <span className="text-gray-400 tracking-widest scale-90">構成比</span>
                        <span className="text-[#d98c77]">販売 {salesPercent}%</span>
                      </div>
                      <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-100">
                        <div className="bg-[#547b97] transition-all duration-500" style={{ width: `${repairPercent}%` }}></div>
                        <div className="bg-[#d98c77] transition-all duration-500" style={{ width: `${salesPercent}%` }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 下部のナビゲーション表示 */}
        <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 px-3 mt-1 h-6">
          <button 
            onClick={() => setActiveIndex(activeIndex - 1)} 
            className={`w-24 text-left tracking-wider ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            &lt;&lt; {activeIndex === 1 ? "お知らせ" : "できること"}
          </button>
          
          <div className="flex gap-1.5 justify-center flex-1">
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeIndex === 0 ? 'bg-[#eaaa43] w-3' : 'bg-gray-200'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeIndex === 1 ? 'bg-[#eaaa43] w-3' : 'bg-gray-200'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeIndex === 2 ? 'bg-[#eaaa43] w-3' : 'bg-gray-200'}`}></span>
          </div>

          <button 
            onClick={() => setActiveIndex(activeIndex + 1)} 
            className={`w-24 text-right tracking-wider ${activeIndex === 2 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            {activeIndex === 0 ? "できること" : "集計"} &gt;&gt;
          </button>
        </div>
      </div>

      {/* =========================================
          ★ 追加: パネルタップ時の全画面ポップアップ（モーダル）
          ========================================= */}
      {activeModal && (
        <div className="fixed inset-0 bg-[#f8f6f0] z-[100] flex flex-col animate-fade-in overflow-y-auto">
          
          {/* ポップアップ共通ヘッダー */}
          <div className="sticky top-0 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] px-4 py-4 flex justify-between items-center z-10">
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 flex items-center font-bold text-sm">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              戻る
            </button>
            <h2 className="text-[#eaaa43] font-black tracking-widest text-base">
              {activeModal === 'notice' && 'お知らせ詳細'}
              {activeModal === 'todo' && 'たったできること'}
              {activeModal === 'summary' && '集計詳細'}
            </h2>
            <div className="w-16"></div> {/* バランス調整用 */}
          </div>

          {/* モーダルの中身 */}
          <div className="p-4 max-w-md mx-auto w-full">
            
            {/* --- お知らせモーダル --- */}
            {activeModal === 'notice' && (
              <div className="bg-white rounded-[20px] shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-4xl">📢</span>
                  {/* 管理者用編集ボタン */}
                  <button onClick={() => { setIsNoticeEditMode(true); setDraftNoticeText(noticeText); }} className="text-gray-400 hover:text-[#eaaa43] p-2 bg-gray-50 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </button>
                </div>
                
                {isNoticeEditMode ? (
                  <div className="animate-fade-in">
                    <h3 className="text-[#eaaa43] font-bold text-base tracking-widest mb-1">お知らせの共有設定</h3>
                    <p className="text-xs text-gray-400 mb-4">※設定は全スタッフの画面に即時反映されます</p>
                    
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                      <span className="text-sm font-bold text-gray-700">通知オン（優先表示）</span>
                      <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${isNoticeActive ? 'bg-[#eaaa43]' : 'bg-gray-300'}`} onClick={() => setIsNoticeActive(!isNoticeActive)}>
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${isNoticeActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                    <textarea 
                      value={draftNoticeText}
                      onChange={(e) => setDraftNoticeText(e.target.value)}
                      className="w-full text-sm p-4 border border-gray-200 rounded-xl outline-none focus:border-[#eaaa43] resize-none h-40 mb-4 bg-gray-50"
                      placeholder="お知らせ内容を入力..."
                      disabled={!isNoticeActive}
                    />
                    <button onClick={handleSaveNotice} disabled={isSavingNotice} className={`w-full text-white font-bold py-4 rounded-xl active:scale-95 transition-transform tracking-widest ${isNoticeActive ? 'bg-[#eaaa43]' : 'bg-gray-400'}`}>
                      {isSavingNotice ? '保存中...' : '全社員へ共有・保存する'}
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in min-h-[200px]">
                    <h4 className="text-[#eaaa43] font-black text-lg mb-4 tracking-widest border-b-2 border-[#eaaa43]/30 pb-2 inline-block">事務局よりお知らせ</h4>
                    <p className="text-sm text-gray-800 font-bold leading-relaxed whitespace-pre-wrap">{isNoticeActive ? noticeText : "現在、お知らせはありません"}</p>
                  </div>
                )}
              </div>
            )}

            {/* --- たったできることモーダル --- */}
            {activeModal === 'todo' && (
              <div className="space-y-4">
                <div className="bg-white rounded-[20px] shadow-sm p-6 border-l-4 border-[#eaaa43]">
                  <h3 className="font-black text-gray-800 text-lg mb-2">1. リピート率向上</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">名札の着用は必須です。訪問時には必ず名刺をお渡しし、お客様に顔と名前を覚えてもらいましょう。小さな信頼の積み重ねが次のお仕事に繋がります。</p>
                </div>
                <div className="bg-white rounded-[20px] shadow-sm p-6 border-l-4 border-blue-400">
                  <h3 className="font-black text-gray-800 text-lg mb-2">2. 緊急時の案内</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">水漏れなどの緊急時には、まずお客様に「止水栓」や「水道メーター」の位置をお伝えし、応急処置ができるように案内してください。</p>
                </div>
                <div className="bg-white rounded-[20px] shadow-sm p-6 border-l-4 border-green-400">
                  <h3 className="font-black text-gray-800 text-lg mb-2">3. インターフォン越しの名札提示</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">防犯意識が高まっています。インターフォンを押す際は、カメラに向かって名札をはっきりと提示し、身分と目的を明るく伝えましょう。</p>
                </div>
                <div className="bg-white rounded-[20px] shadow-sm p-6 border-l-4 border-purple-400">
                  <h3 className="font-black text-gray-800 text-lg mb-2">4. 訪問前日在宅確認</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">ご依頼から1週間以上経過している案件については、すれ違いを防ぐため、必ず訪問の前日にお客様へ在宅確認の連絡を入れてください。</p>
                </div>
              </div>
            )}

            {/* --- 集計詳細モーダル --- */}
            {activeModal === 'summary' && (
              <div className="bg-white rounded-[20px] shadow-sm p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="font-black text-gray-800 text-lg tracking-widest">売上詳細レポート</h3>
                  <span className="text-xs text-[#eaaa43] font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    {assignee === "" || assignee === "add" ? "会社全体" : assignee}
                  </span>
                </div>
                
                <div className="flex gap-2 mb-6 bg-gray-50 p-1.5 rounded-xl">
                  <button onClick={() => setSummaryPeriod('day')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${summaryPeriod === 'day' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>当日</button>
                  <button onClick={() => setSummaryPeriod('month')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${summaryPeriod === 'month' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>当月</button>
                  <button onClick={() => setSummaryPeriod('year')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${summaryPeriod === 'year' ? 'bg-white text-[#eaaa43] shadow-sm' : 'text-gray-400'}`}>年</button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-500 font-bold">技術料</span>
                    <span className="text-xl font-black text-gray-800"><span className="text-sm font-normal mr-1 text-gray-400">¥</span>{techSum.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#547b97]/5 rounded-xl p-4 flex justify-between items-center border border-[#547b97]/10">
                    <span className="text-[#547b97] font-bold">修理合計</span>
                    <span className="text-xl font-black text-[#547b97]"><span className="text-sm font-normal mr-1">¥</span>{repairSum.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#d98c77]/5 rounded-xl p-4 flex justify-between items-center border border-[#d98c77]/10">
                    <span className="text-[#d98c77] font-bold">販売金額</span>
                    <span className="text-xl font-black text-[#d98c77]"><span className="text-sm font-normal mr-1">¥</span>{salesSum.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <h4 className="text-xs font-bold text-gray-400 text-center mb-3 tracking-widest">売上構成比</h4>
                  <div className="flex justify-between text-sm font-black mb-2 px-1">
                    <span className="text-[#547b97]">修理 {repairPercent}%</span>
                    <span className="text-[#d98c77]">販売 {salesPercent}%</span>
                  </div>
                  <div className="flex w-full h-4 rounded-full overflow-hidden bg-gray-100">
                    <div className="bg-[#547b97] transition-all duration-500" style={{ width: `${repairPercent}%` }}></div>
                    <div className="bg-[#d98c77] transition-all duration-500" style={{ width: `${salesPercent}%` }}></div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

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
