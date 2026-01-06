export const LoginViewTemplate = `import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email address</label>
            <input 
              type="email" 
              placeholder="admin@nextlara.com" 
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all font-body"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all font-body"
            />
          </div>
          <button className="w-full py-4 rounded-xl bg-white text-[#020617] font-black hover:bg-slate-100 transition-colors shadow-lg shadow-white/5 active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-body">
          Don't have an account? <a href="/register" className="text-sky-400 font-bold hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
`;

export const RegisterViewTemplate = `import React from 'react';

export default function Register() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-black text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Start your journey with Nextlara today.</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all font-body"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email address</label>
            <input 
              type="email" 
              placeholder="admin@nextlara.com" 
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all font-body"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all font-body"
            />
          </div>
          <button className="w-full py-4 rounded-xl bg-white text-[#020617] font-black hover:bg-slate-100 transition-colors shadow-lg shadow-white/5 active:scale-[0.98]">
            Get Started
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-body">
          Already have an account? <a href="/login" className="text-sky-400 font-bold hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}
`;
