import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
      
      {/* ヘッダー部分 */}
      <div className="text-center mb-12 mt-8">
        <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-2 inline-block">App Hub</span>
        <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-950">
          TOP画面 <span className="text-xl text-slate-400 font-medium">(ハブ)</span>
        </h1>
        <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-6"></div>
      </div>
      
      {/* 4つのボタンを配置するグリッド */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Aボタン：日報入力 (ここだけ押せるようにリンク設定) */}
        <Link href="/report" className="group block bg-white border border-slate-100 shadow-xl rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-72">
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-2 bg-orange-100 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-6xl sm:text-7xl relative">📝</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">A</h2>
          <p className="text-lg sm:text-xl font-bold text-slate-700">日報入力</p>
        </Link>
        
        {/* Bボタン：案件管理 */}
        <div className="block bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center opacity-70 flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-72">
          <div className="text-6xl sm:text-7xl grayscale mb-4">📂</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-400 mb-1">B</h2>
          <p className="text-lg sm:text-xl font-bold text-slate-400">案件管理</p>
          <span className="mt-4 inline-block bg-slate-200 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">COMING SOON</span>
        </div>

        {/* Cボタン：ホワイトボード */}
        <div className="block bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center opacity-70 flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-72">
          <div className="text-6xl sm:text-7xl grayscale mb-4">📋</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-400 mb-1">C</h2>
          <p className="text-lg sm:text-xl font-bold text-slate-400">ホワイトボード</p>
          <span className="mt-4 inline-block bg-slate-200 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">COMING SOON</span>
        </div>

        {/* Dボタン：提案リール */}
        <div className="block bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center opacity-70 flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-72">
          <div className="text-6xl sm:text-7xl grayscale mb-4">💡</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-400 mb-1">D</h2>
          <p className="text-lg sm:text-xl font-bold text-slate-400">提案リール</p>
          <span className="mt-4 inline-block bg-slate-200 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">COMING SOON</span>
        </div>

      </div>
      
      <footer className="mt-12 mb-8 text-center text-xs text-slate-400">
        <p>&copy; 2026 keisuke-T-coder. All rights reserved.</p>
      </footer>
    </div>
  );
}
