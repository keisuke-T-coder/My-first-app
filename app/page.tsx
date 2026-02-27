import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
      <div className="text-center mb-16">
        <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-2 inline-block">App Hub</span>
        <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-950">
          TOP画面 <span className="text-xl text-slate-400 font-medium">(ハブ)</span>
        </h1>
        <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-6"></div>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Aボタン：日報入力 */}
        <div className="group block bg-white border border-slate-100 shadow-xl rounded-3xl p-10 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-2 bg-orange-100 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-7xl relative">📝</div>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-black text-slate-900">A</span>
          </div>
          <p className="text-xl font-bold text-slate-700">日報入力</p>
          <p className="text-sm text-slate-500 mt-2">今日の日報を作成、編集します。</p>
        </div>
        
        {/* Bボタン：案件管理（COMIMG SOON） */}
        <div className="block bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center opacity-70">
          <div className="relative inline-block mb-6">
            <div className="text-7xl grayscale">📂</div>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-black text-slate-400">B</span>
          </div>
          <p className="text-xl font-bold text-slate-400">案件管理</p>
          <p className="text-sm text-slate-400 mt-2">案件情報、顧客情報を管理します。</p>
          <span className="mt-4 inline-block bg-slate-200 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">COMING SOON</span>
        </div>
      </div>
      
      <footer className="mt-20 text-center text-xs text-slate-400">
        <p>&copy; 2024 keisuke-T-coder. All rights reserved.</p>
      </footer>
    </div>
  );
}
