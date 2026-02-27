import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
      <h1 className="text-3xl font-black tracking-[0.2em] mb-12 text-center">
        TOP画面 <span className="text-xl text-slate-400 font-bold">(ハブ)</span>
      </h1>
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Aボタン：日報入力 */}
        <div className="group block bg-white border border-slate-200 shadow-sm rounded-[32px] p-10 text-center transition-all">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-black mb-2 tracking-widest text-slate-800 uppercase">A</h2>
          <p className="text-lg font-bold text-slate-600">日報入力</p>
        </div>
        {/* Bボタン：案件管理 */}
        <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-10 text-center opacity-60">
          <div className="text-6xl mb-4 grayscale">📂</div>
          <h2 className="text-2xl font-black text-slate-400 mb-2 tracking-widest uppercase">B</h2>
          <p className="text-lg font-bold text-slate-400">案件管理</p>
          <span className="mt-2 inline-block bg-slate-200 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">COMING SOON</span>
        </div>
      </div>
    </div>
  );
}
