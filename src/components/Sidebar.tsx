import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
  Wrench,
  XCircle,
  Database,
  ArrowRightCircle,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingCount?: number;
  onOpenSQLModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingCount = 0,
  onOpenSQLModal,
}) => {
  const { user, signOut, isSuperAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'all', label: 'All Complaints', icon: <FileText className="w-4 h-4" /> },
    {
      id: 'Pending',
      label: 'Pending',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    { id: 'Accepted', label: 'Accepted', icon: <ArrowRightCircle className="w-4 h-4 text-blue-500" /> },
    { id: 'In Progress', label: 'In Progress', icon: <Wrench className="w-4 h-4 text-purple-500" /> },
    { id: 'Resolved', label: 'Resolved', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    { id: 'Rejected', label: 'Rejected', icon: <XCircle className="w-4 h-4 text-rose-500" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-indigo-500" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Admin header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Admin Console</h2>
            <p className="text-[11px] text-slate-400">Sapthagiri NPS University</p>
          </div>
        </div>

        {/* Current Admin badge */}
        <div className="mt-3 p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
          <div className="truncate mr-2">
            <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
            <p className="text-[10px] text-indigo-400 font-mono">
              {isSuperAdmin ? 'SUPER ADMIN' : 'CAMPUS ADMIN'}
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active session" />
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Management
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full tabular-nums ${
                    isActive ? 'bg-white text-indigo-700' : 'bg-amber-500 text-slate-900'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Super Admin section */}
        {isSuperAdmin && (
          <>
            <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Governance
            </div>
            <button
              onClick={() => onSelectTab('admin-management')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentTab === 'admin-management'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Admin Management</span>
            </button>
          </>
        )}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          System
        </div>
        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'settings'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <button
          onClick={onOpenSQLModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Supabase SQL Script</span>
        </button>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
