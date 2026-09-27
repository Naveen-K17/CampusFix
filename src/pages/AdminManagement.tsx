import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { AdminRequest } from '../types/database';
import {
  dbFetchAdminRequests,
  dbCreateAdminRequest,
  dbUpdateAdminRequestStatus,
} from '../lib/supabase';
import { Modal } from '../components/Modal';
import { formatDate } from '../lib/utils';
import {
  Check,
  Shield,
  ShieldAlert,
  UserCheck,
  UserPlus,
  UserX,
  X,
  AlertCircle,
  Key,
} from 'lucide-react';

export const AdminManagement: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const { addToast } = useNotifications();

  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Add Admin Modal
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'super_admin'>('admin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    const data = await dbFetchAdminRequests();
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">
          Super Admin Privileges Required
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Only the designated primary Super Administrator (naveenkattimani326@gmail.com) is authorized
          to provision and oversee administrator credentials.
        </p>
      </div>
    );
  }

  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newName.trim() || !newEmail.trim()) {
      setErrorMsg('Please enter both name and email.');
      return;
    }

    try {
      const created = await dbCreateAdminRequest(newName.trim(), newEmail.trim(), newRole);
      setRequests((prev) => [created, ...prev]);
      setAddModalOpen(false);
      setNewName('');
      setNewEmail('');
      addToast('Administrator Added', `Invitation recorded for ${newEmail}.`, 'success');
    } catch {
      setErrorMsg('Failed to create admin invitation.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: AdminRequest['status']) => {
    if (!user) return;
    const ok = await dbUpdateAdminRequestStatus(id, newStatus, user.id);
    if (ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      addToast('Admin Status Updated', `Status updated to ${newStatus}.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Admin Access & Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin Control Center · Sapthagiri NPS University
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {/* Primary Admin Notice */}
      <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-start gap-3">
        <Key className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-900">
            Primary Super Administrator: naveenkattimani326@gmail.com
          </p>
          <p className="mt-0.5 text-slate-600">
            Normal student registration never grants administrative privileges. Any new staff member or
            lab technician must be explicitly approved through this panel or registered in Supabase.
          </p>
        </div>
      </div>

      {/* Admin List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Approved & Pending Administrators
          </span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {requests.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/80">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Primary Super Admin row (fixed) */}
              <tr className="bg-indigo-50/20 font-medium">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Naveen Kattimani</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">
                      ROOT
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-indigo-700">
                  naveenkattimani326@gmail.com
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs font-bold text-purple-700">Super Admin</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Active
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 font-mono">System Default</td>
                <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                  Protected
                </td>
              </tr>

              {/* Dynamic requests */}
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {req.requested_name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {req.requested_email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        req.requested_role === 'super_admin'
                          ? 'text-purple-600'
                          : 'text-indigo-600'
                      }`}
                    >
                      {req.requested_role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded border capitalize ${
                        req.status === 'approved'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : req.status === 'pending'
                          ? 'text-amber-700 bg-amber-50 border-amber-200'
                          : req.status === 'disabled'
                          ? 'text-slate-500 bg-slate-100 border-slate-200'
                          : 'text-rose-700 bg-rose-50 border-rose-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono tabular-nums text-[11px]">
                    {formatDate(req.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {req.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(req.id, 'approved')}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                        >
                          Approve
                        </button>
                      )}

                      {req.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(req.id, 'disabled')}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                        >
                          Disable
                        </button>
                      )}

                      {req.status === 'disabled' && (
                        <button
                          onClick={() => handleStatusChange(req.id, 'approved')}
                          className="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200"
                        >
                          Enable
                        </button>
                      )}

                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(req.id, 'rejected')}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Administrator Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Invite / Add Administrator"
        subtitle="Grant maintenance management privileges to a staff or faculty member"
        footer={
          <>
            <button
              onClick={() => setAddModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAdminSubmit}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Authorize & Save
            </button>
          </>
        }
      >
        <form onSubmit={handleAddAdminSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Ramesh Gowda"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official University Email *
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="ramesh.maintenance@sapthagiri.edu.in"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Administrative Role *
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'admin' | 'super_admin')}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="admin">Campus Admin (Review, Accept, Resolve)</option>
              <option value="super_admin">Super Admin (Full privileges & user management)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
