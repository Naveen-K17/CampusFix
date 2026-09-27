import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CSE_CLASSES } from '../lib/utils';
import { AlertCircle, CheckCircle, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

interface RegisterProps {
  onNavigate: (view: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { signUp, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [semester, setSemester] = useState('Semester 5');
  const [cseClass, setCseClass] = useState('CSE-17');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid college email address.');
      return;
    }
    if (!studentId.trim()) {
      setErrorMsg('Please enter your USN / Student ID (e.g. 1SG22CS017).');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = await signUp({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      studentId: studentId.trim().toUpperCase(),
      branch,
      year,
      semester,
      cseClass,
    });

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Registration successful! Redirecting to student dashboard...');
      setTimeout(() => {
        onNavigate('student-dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mb-2">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Registration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sapthagiri NPS University · Computer Science & Engineering
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aditya Sharma"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>

            {/* USN / Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                USN / Student ID *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 1SG22CS017"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent uppercase font-mono"
              />
            </div>
          </div>

          {/* College Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              College Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.name@sapthagiri.edu.in"
                className="w-full text-xs px-3 py-2 pl-9 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Information Science & Engineering">ISE</option>
                <option value="Artificial Intelligence & Data Science">AI & DS</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={`Semester ${i + 1}`}>
                    Semester {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CRITICAL: CSE Class (CSE-1 to CSE-50 ONLY - NO Section A/B/C) */}
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <label className="block text-xs font-bold text-indigo-950 mb-1">
              CSE Class * (Select from CSE-1 to CSE-50)
            </label>
            <p className="text-[11px] text-indigo-700 mb-2 leading-relaxed">
              Your reported complaints will be automatically cataloged under this class identifier.
            </p>
            <select
              value={cseClass}
              onChange={(e) => setCseClass(e.target.value)}
              className="w-full text-xs font-semibold font-mono px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600 text-indigo-900"
            >
              {CSE_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs px-3 py-2 pl-9 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full text-xs px-3 py-2 pl-9 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Already registered?</span>
          <button
            onClick={() => onNavigate('login')}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Log in to your account
          </button>
        </div>
      </div>
    </div>
  );
};
