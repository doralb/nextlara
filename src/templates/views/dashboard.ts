export const DashboardViewTemplate = `import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 font-body">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col p-6 pointer-events-auto shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500" />
          <h2 className="font-heading text-xl font-black tracking-tight">Nextlara</h2>
        </div>
        
        <nav className="space-y-1.5 flex-1">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-500/10 text-sky-400 font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6h4v6"/><path d="M2 11l10-9 10 9v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V11z"/></svg>
            Projects
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17l-6-6-2 2-4-4"/></svg>
            Analytics
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Settings
          </a>
        </nav>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold text-[#020617]">AU</div>
            <div className="overflow-hidden">
              <p className="text-sm font-black truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@nextlara.com</p>
            </div>
          </div>
          <a href="/" className="block w-full py-2.5 rounded-xl bg-slate-800 text-center text-xs font-bold text-red-400 hover:bg-slate-700 transition-colors">
            Sign Out
          </a>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-heading text-3xl font-black mb-1">Overview</h1>
            <p className="text-slate-500 font-body">Welcome back, here is what's happening.</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-sky-500 text-[#020617] font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/20">
            Create New
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 font-body">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Total Sales</p>
            <h3 className="text-3xl font-black">$45,231</h3>
            <div className="mt-2 text-xs text-emerald-500 font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              +12.5% vs last month
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">New Customers</p>
            <h3 className="text-3xl font-black">+2,405</h3>
            <div className="mt-2 text-xs text-emerald-500 font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              +18.2% vs last month
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Growth Rate</p>
            <h3 className="text-3xl font-black">2.4%</h3>
            <div className="mt-2 text-xs text-red-500 font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
              -0.5% vs last month
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="font-heading text-xl font-black mb-6">Recent Activity</h3>
          <div className="space-y-4 font-body">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors px-4 -mx-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                    ID
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Transaction #{i + 1024}</p>
                    <p className="text-sm text-slate-500">Customer purchase completed successfully</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-white">$129.00</p>
                  <p className="text-xs text-slate-500">{i} hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
`;
