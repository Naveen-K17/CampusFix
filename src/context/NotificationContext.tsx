import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, dbFetchNotifications, dbMarkNotificationRead } from '../lib/supabase';
import { AppNotification } from '../types/database';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  toasts: ToastMessage[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const data = await dbFetchNotifications(user.id);
    setNotifications(data);
  }, [user]);

  // Initial fetch and Realtime subscription
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    refreshNotifications();

    // Supabase Realtime subscription
    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
    if (supabase) {
      channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotif = payload.new as AppNotification;
            setNotifications((prev) => [newNotif, ...prev]);
            addToast(newNotif.title, newNotif.message, 'info');
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'complaints',
          },
          (payload) => {
            // If admin changes complaint for this student
            const updated = payload.new as { student_id?: string; status?: string; complaint_number?: string };
            if (updated.student_id === user.id) {
              const status = updated.status;
              let msg = `Your complaint ${updated.complaint_number || ''} status updated to ${status}.`;
              if (status === 'Accepted') {
                msg = 'Your complaint has been accepted by the administration.';
              } else if (status === 'In Progress') {
                msg = 'Work has started on your complaint.';
              } else if (status === 'Resolved') {
                msg = 'Your complaint has been resolved.';
              }
              addToast(`Complaint ${status}`, msg, status === 'Resolved' ? 'success' : 'info');
              refreshNotifications();
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, addToast, refreshNotifications]);

  const markAsRead = async (id: string) => {
    await dbMarkNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    for (const notif of notifications.filter((n) => !n.is_read)) {
      await dbMarkNotificationRead(notif.id);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        markAsRead,
        markAllAsRead,
        addToast,
        removeToast,
        refreshNotifications,
      }}
    >
      {children}

      {/* Floating Animated Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700/80 animate-in slide-in-from-bottom-3 duration-300"
          >
            <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-blue-400 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-wide text-blue-300 uppercase">
                {toast.title}
              </p>
              <p className="text-sm text-slate-200 mt-0.5 leading-snug break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white text-xs px-1"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
