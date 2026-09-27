import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, ShieldAlert, ShieldCheck, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onNavigate: (view: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate }) => {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('naveenkattimani326@gmail.com');
  const [password, setPassword] = useState('Naveen@2005');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await signIn(email.trim(), password);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      if (res.role === 'admin' || res.role === 'super_admin') {
        onNavigate('admin-dashboard');
      } else {
        setErrorMsg('Admin access has not been granted to this account.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 text-white">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Administrator Gateway
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sapthagiri NPS University Campus Maintenance Department
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMsg}</p>
              {errorMsg.includes('not been granted') && (
                <p className="text-[11px] text-rose-300/80 mt-1">
                  Only verified administrators and the Super Admin are permitted in this section.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Official Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sapthagiri.edu.in"
                className="w-full text-xs px-3 py-2 pl-9 rounded-lg bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full text-xs px-3 py-2 pl-9 rounded-lg bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Open Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700 text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            &larr; Return to Student Portal
          </button>
        </div>
      </div>
    </div>
  );
};
