import Link from 'next/link';

// センスの良い線画SVGアイコンコンポーネント（くすみカラー対応）
const PencilRulerIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m14 2 8 8" />
    <path d="m3 21 8-8" />
    <path d="M11 2h.1" />
    <path d="M7 2a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4Z" />
    <path d="M3 11a2 2 0 0 1 4 0v10a2 2 0 0 1-4 0Z" />
    <path d="M12 21h10v-3.3" />
    <path d="M12 17.6v-5.6" />
    <path d="m16.8 12 4.1 4.1" />
  </svg>
);

const FolderHeartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2Z" />
    <path d="M12.5 12a2.5 2.5 0 1 0-5 0c0 1.25 1 2 2.5 3 1.5-1 2.5-1.75 2.5-3Z" />
  </svg>
);

const BookTextIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <path d="M12 6h2" />
    <path d="M12 10h2" />
    <path d="M12 14h2" />
    <path d="M8 6h2" />
    <path d="M8 10h2" />
    <path d="M8 14h2" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.937 15.512a2.002 2.002 0 0 1 1.063.811c.202.327.32.7.35 1.082a2.004 2.004 0 0 1 1.764 1.764c.327-.202.7-.32 1.082-.35a2.003 2.003 0 0 1 1.874-1.874 2.004 2.004 0 0 1 .35-1.082 2.001 2.001 0 0 1 1.81-1.063c.327-.202.7-.32 1.082-.35a2.003 2.003 0 0 1-1.874-1.874c.2-.327.32-.7.35-1.082a2.004 2.004 0 0 1-1.764-1.764c-.327.202-.7.32-1.082.35a2.003 2.003 0 0 1-1.874 1.874c-.2.327-.32.7-.35 1.082a2.004 2.004 0 0 1-1.764 1.764c.327-.202.7-.32 1.082-.35a2.003 2.003 0 0 1 1.874-1.874Zm.111-1.5a2.003 2.003 0 0 1 1.874 1.874a2.003 2.003 0 0 1 1.874-1.874a2.003 2.003 0 0 1 1.874 1.874a2.003 2.003 0 0 1-1.874 1.874a2.003 2.003 0 0 1-1.874 1.874a2.003 2.003 0 0 1-1.874-1.874a2.003 2.003 0 0 1-1.874-1.874Z" />
    <path d="M12 3a.9.9 0 0 0-.9-.9A.9.9 0 0 0 12 3a.9.9 0 0 0 .9.9A.9.9 0 0 0 12 3Z" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcf8f6] flex flex-col font-medium text-slate-800">
      <header className="p-8 flex justify-center items-center">
        <h1 className="text-2xl font-semibold tracking-widest text-slate-700">TOP画面</h1>
      </header>

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-8 w-full">
          
          {/* A 日報入力 */}
          <Link href="/report" className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center cursor-pointer">
            <div className="mb-6">
              <PencilRulerIcon className="w-16 h-16 text-[#d98c77]" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-2">日報入力</h2>
            <p className="text-sm text-slate-600">今日の日報を作成、編集します。</p>
          </Link>

          {/* B 案件管理 */}
          <button className="bg-white p-10 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center justify-center aspect-square text-center opacity-60 grayscale cursor-not-allowed">
            <div className="mb-6">
              <FolderHeartIcon className="w-16 h-16 text-[#8baec6]" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-2">案件管理</h2>
            <p className="text-sm text-slate-600">案件情報、顧客情報を管理します。</p>
            <span className="text-xs text-slate-500 mt-4 bg-slate-100 px-3 py-1 rounded-full font-semibold">準備中</span>
          </button>

          {/* C ホワイトボード */}
          <button className="bg-white p-10 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center justify-center aspect-square text-center opacity-60 grayscale cursor-not-allowed">
            <div className="mb-6">
              <BookTextIcon className="w-16 h-16 text-[#9cb7a3]" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-2">ホワイトボード</h2>
            <p className="text-sm text-slate-600">チームの連絡事項、メモを共有します。</p>
            <span className="text-xs text-slate-500 mt-4 bg-slate-100 px-3 py-1 rounded-full font-semibold">準備中</span>
          </button>

          {/* D 提案リール */}
          <button className="bg-white p-10 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center justify-center aspect-square text-center opacity-60 grayscale cursor-not-allowed">
            <div className="mb-6">
              <SparklesIcon className="w-16 h-16 text-[#d7c4a1]" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-2">提案リール</h2>
            <p className="text-sm text-slate-600">新しいアイデア、提案を共有します。</p>
            <span className="text-xs text-slate-500 mt-4 bg-slate-100 px-3 py-1 rounded-full font-semibold">準備中</span>
          </button>
          
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-slate-500">
        <p>&copy; 2024 keisuke-T-coder. All rights reserved.</p>
      </footer>
    </div>
  );
}
