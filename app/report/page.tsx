import Link from 'next/link';

export default function ReportMenu() {
  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center font-sans pb-24 relative overflow-hidden text-slate-800">
      
      {/* 画面上部エリア */}
      <div className="w-[92%] max-w-md mt-6 mb-6">
        {/* オレンジヘッダー */}
        <div className="bg-[#eaaa43] rounded-[14px] py-4 px-4 shadow-sm flex items-center justify-between">
          <Link href="/" className="text-white font-bold flex items-center w-16 active:scale-90 transition-transform">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-sm tracking-wider">戻る</span>
          </Link>
          <h1 className="text-white font-bold tracking-widest text-lg flex-1 text-center">日報入力</h1>
          <div className="w-16"></div> {/* 中央揃えのための余白 */}
        </div>

        {/* 担当者選択（デフォルト：選択してください） */}
        <div className="mt-5 flex justify-end">
          <div className="bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center">
            <span className="mr-2 text-sm font-bold text-gray-500">担当:</span>
            <select className="bg-transparent font-black text-slate-800 outline-none appearance-none cursor-pointer pr-2 relative text-sm">
              <option value="">選択してください</option>
              <option value="minami">南</option>
              <option value="tanaka">田中</option>
              <option value="suzuki">鈴木</option>
            </select>
            <span className="text-[10px] text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>
      </div>

      {/* メニューカード一覧 */}
      <div className="flex flex-col gap-5 w-[92%] max-w-md mt-2">
        
        {/* A-1 新規入力 (今回はここだけモックアップへのリンクを付けます) */}
        <Link href="/report/new" className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100">
          <p className="text-[#eaaa43] font-bold text-sm mb-2 tracking-widest">A - 1</p>
          <h2 className="text-[1.4rem] font-black text-gray-900 tracking-widest mb-4">新規入力</h2>
          <div className="w-[30%] max-w-[50px] h-[3px] rounded-full bg-[#cba358]"></div>
        </Link>

        {/* A-2 当日一覧 */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <p className="text-[#eaaa43] font-bold text-sm mb-2 tracking-widest">A - 2</p>
          <h2 className="text-[1.4rem] font-black text-gray-900 tracking-widest mb-4">当日一覧</h2>
          <div className="w-[30%] max-w-[50px] h-[3px] rounded-full bg-[#cba358]"></div>
        </div>

        {/* A-3 過去履歴 */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] py-8 flex flex-col items-center justify-center active:scale-95 transition-transform border border-transparent hover:border-orange-100 cursor-pointer">
          <p className="text-[#eaaa43] font-bold text-sm mb-2 tracking-widest">A - 3</p>
          <h2 className="text-[1.4rem] font-black text-gray-900 tracking-widest mb-4">過去履歴</h2>
          <div className="w-[30%] max-w-[50px] h-[3px] rounded-full bg-[#cba358]"></div>
        </div>

      </div>

      {/* 画面下のナビゲーションバー（TabBar） */}
      <div className="fixed bottom-0 w-full bg-white rounded-t-[30px] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] h-[70px] flex justify-around items-center px-4 max-w-md mx-auto pb-2 z-10">
        <Link href="/" className="p-2 cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
        <div className="p-2 cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
        <div className="p-2 cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#eaaa43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div className="p-2 cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
        <span className="absolute bottom-[6px] right-4 text-[10px] text-gray-400 italic">app version 1.0</span>
      </div>

    </div>
  );
}
