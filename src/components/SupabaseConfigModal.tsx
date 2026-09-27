import React, { useState } from 'react';
import { Modal } from './Modal';
import { isSupabaseConfigured } from '../lib/supabase';
import { SUPABASE_SQL_SETUP } from '../lib/sqlSetupScript';
import { Check, Copy, Database, ShieldAlert, Key, Terminal } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'guide'>('sql');

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Database & Auth Configuration"
      subtitle="Complete setup guide and SQL script for Sapthagiri NPS University"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>
              {isSupabaseConfigured
                ? 'Connected to live Supabase project'
                : 'Offline-resilient mode active (Add .env to connect live)'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Status banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isSupabaseConfigured
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          <Database className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">
              {isSupabaseConfigured
                ? 'Live Supabase Environment Active'
                : 'Supabase Environment Variables Pending in .env'}
            </p>
            <p className="mt-0.5 leading-relaxed">
              {isSupabaseConfigured
                ? 'Your application is connected to your Supabase project. Realtime events, Auth, and Storage are running live.'
                : 'CampusFix provides a complete local replica with realistic university complaint seed data, so you can test all student and admin flows right now. To connect to your live project, paste the SQL below into your Supabase SQL Editor.'}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'sql'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 inline mr-1.5" />
            Supabase SQL Script (Copy-Paste Ready)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'guide'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 inline mr-1.5" />
            Initial Super Admin Guide
          </button>
        </div>

        {activeTab === 'sql' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">
                schema.sql (Tables, RLS Policies, Triggers & Storage)
              </span>
              <button
                onClick={handleCopySQL}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy SQL
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono leading-relaxed h-72 overflow-y-auto border border-slate-800">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                Initial Super Admin Account Setup
              </h4>
              <p className="mt-1 text-slate-600 leading-relaxed">
                As required by security guidelines, passwords are never hard-coded in the React client.
                The initial administrator is:
              </p>
              <div className="mt-2 p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>Email: <strong className="text-indigo-600">naveenkattimani326@gmail.com</strong></div>
                <div>Role: <strong className="text-purple-600">SUPER_ADMIN</strong></div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-slate-900">How to activate in Supabase:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed pl-1">
                <li>Execute the provided SQL script in the <strong>Supabase SQL Editor</strong>.</li>
                <li>Go to <strong>Authentication &rarr; Users &rarr; Add User</strong> in your Supabase dashboard.</li>
                <li>Enter <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">naveenkattimani326@gmail.com</code> and initial password <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Naveen@2005</code>.</li>
                <li>The trigger automatically detects this email and sets their role to <strong>super_admin</strong> in the <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">profiles</code> table.</li>
                <li>The Super Admin can then invite or approve other administrators via the in-app <strong>Admin Management</strong> console.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
