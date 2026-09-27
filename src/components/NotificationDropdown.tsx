import React, { useRef, useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatRelativeTime } from '../lib/utils';

export const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full tabular-nums">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium text-slate-500">No notifications yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Updates on complaints will appear here
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`p-3.5 text-left transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                    !n.is_read ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !n.is_read ? 'bg-indigo-600 ring-2 ring-indigo-200' : 'bg-slate-300'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!n.is_read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(n.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
