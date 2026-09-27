import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { LogOut, Menu, PlusCircle, Shield, User, X, Wrench } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, id?: string) => void;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSupabaseModal,
}) => {
  const { user, signOut, isAdmin, isSuperAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 text-left group focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              CampusFix
            </span>
          </button>

          {/* Discreet University Kicker */}
          <span className="hidden lg:inline-block text-xs text-slate-400 font-medium pl-3 border-l border-slate-200">
            Sapthagiri NPS University
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNavClick('landing')}
            className={`hover:text-indigo-600 transition-colors ${
              currentView === 'landing' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Overview
          </button>

          {user && (
            <button
              onClick={() => handleNavClick(isAdmin ? 'admin-dashboard' : 'student-dashboard')}
              className={`hover:text-indigo-600 transition-colors ${
                currentView === 'student-dashboard' || currentView === 'admin-dashboard'
                  ? 'text-indigo-600 font-semibold'
                  : ''
              }`}
            >
              Dashboard
            </button>
          )}

          <button
            onClick={() => handleNavClick('report')}
            className={`hover:text-indigo-600 transition-colors ${
              currentView === 'report' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Report Issue
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`flex items-center gap-1.5 hover:text-indigo-600 transition-colors ${
                currentView.startsWith('admin') ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              Admin Portal
            </button>
          )}

          <button
            onClick={onOpenSupabaseModal}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
          >
            Database & SQL
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification dropdown */}
              <NotificationDropdown />

              {/* Quick Report Issue Button (for students) */}
              {!isAdmin && currentView !== 'report' && (
                <button
                  onClick={() => handleNavClick('report')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Report Issue
                </button>
              )}

              {/* User profile dropdown / info */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.full_name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {isSuperAdmin
                      ? 'Super Admin'
                      : isAdmin
                      ? 'Admin'
                      : user.cse_class || 'CSE Student'}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 text-xs font-bold">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={signOut}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm font-medium">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full text-left py-2 text-slate-700 hover:text-indigo-600"
          >
            Overview
          </button>
          {user && (
            <button
              onClick={() => handleNavClick(isAdmin ? 'admin-dashboard' : 'student-dashboard')}
              className="w-full text-left py-2 text-slate-700 hover:text-indigo-600"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => handleNavClick('report')}
            className="w-full text-left py-2 text-slate-700 hover:text-indigo-600"
          >
            Report Campus Issue
          </button>
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className="w-full text-left py-2 text-indigo-600 font-semibold flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
          )}
          <button
            onClick={() => {
              onOpenSupabaseModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-slate-500 hover:text-slate-900"
          >
            Supabase SQL Setup Guide
          </button>

          {!user && (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="flex-1 py-2 text-center text-xs font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
