import React from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  Building2,
  Database,
  Key,
  Shield,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SettingsProps {
  onOpenSQLModal: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onOpenSQLModal }) => {
  const { user, isSuperAdmin, isAdmin } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System & Account Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          CampusFix system configuration and user credentials
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          Active Account Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Full Name</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
              {user?.full_name}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Email Address</span>
            <span className="font-mono text-slate-800 text-sm mt-0.5 block truncate">
              {user?.email}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Designated Role</span>
            <span className="font-semibold text-indigo-600 text-sm mt-0.5 block">
              {isSuperAdmin
                ? 'Super Administrator'
                : isAdmin
                ? 'Campus Administrator'
                : 'Student'}
            </span>
          </div>

          {!isAdmin && (
            <>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">USN / Student ID</span>
                <span className="font-mono text-slate-800 font-bold mt-0.5 block">
                  {user?.student_id || 'N/A'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">CSE Class</span>
                <span className="font-mono text-indigo-700 font-bold text-sm mt-0.5 block">
                  {user?.cse_class}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Academic Year</span>
                <span className="text-slate-800 font-medium mt-0.5 block">
                  {user?.year}, {user?.semester}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* University Campus Reference */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          University Campus Registry
        </h3>

        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-900">Institution:</strong> Sapthagiri NPS University
          </p>
          <p>
            <strong className="text-slate-900">Campus Location:</strong> 14/5, Chikkasandra, Hesaraghatta Main Road, Bengaluru, Karnataka 560057
          </p>
          <p>
            <strong className="text-slate-900">Covered Academic Blocks:</strong> Block A, Block B, and Block C.
          </p>
          <p>
            <strong className="text-slate-900">Registered Classes:</strong> CSE-1 through CSE-50 (Department of Computer Science & Engineering).
          </p>
        </div>
      </div>

      {/* Supabase Connection & Schema Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            Supabase Backend & Security Status
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Connection Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Local Resilient Mode Active
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          CampusFix is designed with full Supabase integration (Authentication, PostgreSQL with Row Level Security,
          Realtime updates, and Storage for complaint image uploads).
        </p>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onOpenSQLModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Open SQL Script & Setup Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
};
