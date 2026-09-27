import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onNavigate: (view: string) => void;
  defaultRoleHint?: 'student' | 'admin';
}

export const Login: React.FC<LoginProps> = ({ onNavigate, defaultRoleHint = 'student' }) => {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const res = await signIn(email.trim(), password);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      if (res.role === 'admin' || res.role === 'super_admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    }
  };

  const fillDemoStudent = () => {
    setEmail('aditya.cse17@sapthagiri.edu.in');
    setPassword('student123');
  };

  const fillDemoAdmin = () => {
    setEmail('naveenkattimani326@gmail.com');
    setPassword('Naveen@2005');
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign In to CampusFix
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sapthagiri NPS University Campus Portal
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sapthagiri.edu.in or admin email"
                className="w-full text-xs px-3 py-2 pl-9 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your account password"
                className="w-full text-xs px-3 py-2 pl-9 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo fast-fill buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-2.5">
            Quick Fill Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors text-center text-[11px]"
            >
              Student (CSE-17)
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-700 font-medium transition-colors text-center text-[11px]"
            >
              Super Admin
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-slate-500">
          <span>Need a student account? </span>
          <button
            onClick={() => onNavigate('register')}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};
