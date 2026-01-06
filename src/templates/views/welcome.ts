export const WelcomeTemplate = (starter: string) => `import React from 'react';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-sky-500/30 font-body">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          Nextlara 1.0.6 is here
        </div>

        <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1] animate-slide-up">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Laravel</span> Experience.<br />
          Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Next.js</span>.
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 leading-relaxed animate-slide-up delay-100">
          Stop worrying about folder-based routing and file-system complexity. 
          Experience centralized routes, a powerful CLI, and a structure that scale with your ambitions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up delay-200">
          <a href="https://github.com/doralb/nextlara" 
             className="px-8 py-4 rounded-xl bg-white text-[#020617] font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
            Get Started
          </a>
          ${starter === 'auth' ? `
          <a href="/dashboard" 
             className="px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 font-bold transition-all hover:bg-slate-700 hover:scale-105 active:scale-95">
            Dashboard
          </a>
          ` : `
          <div className="px-6 py-4 rounded-xl bg-slate-900/50 border border-slate-800 font-mono text-sky-400 select-all">
            bob new app
          </div>
          `}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-slide-up delay-300">
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-left hover:border-sky-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
            <h3 className="font-heading text-xl font-bold mb-2 text-white">Centralized Routing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">No more nested folders. Define all your routes in one place, just like Laravel.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-left hover:border-indigo-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
            </div>
            <h3 className="font-heading text-xl font-bold mb-2 text-white">Powerful CLI</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Artisan-inspired "bob" command. Generate controllers, models, and migrations in seconds.</p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-left hover:border-purple-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="font-heading text-xl font-bold mb-2 text-white">Middleware & Policies</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Enterprise-grade security architecture out of the box. Protect your routes with ease.</p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-900 py-10 text-center">
        <p className="text-slate-500 text-sm">
          Nextlara Framework &copy; {new Date().getFullYear()} - Designed with ❤️ for productivity.
        </p>
      </footer>

      <style jsx global>{\`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { opacity: 0; animation: slide-up 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      \`}</style>
  </div>
  );
}
`;
