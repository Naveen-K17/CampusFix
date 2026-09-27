import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintUpdate,
} from '../types/database';
import {
  dbFetchComplaintById,
  dbUpdateComplaintStatus,
  dbUpdateComplaintPriority,
} from '../lib/supabase';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Timeline } from '../components/Timeline';
import { Modal } from '../components/Modal';
import { formatDate } from '../lib/utils';
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Shield,
  User,
  Wrench,
  XCircle,
} from 'lucide-react';

interface ComplaintDetailsProps {
  complaintId: string;
  onNavigate: (view: string) => void;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaintId,
  onNavigate,
}) => {
  const { user, isAdmin } = useAuth();
  const { addToast } = useNotifications();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [updates, setUpdates] = useState<ComplaintUpdate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals for admin actions
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const [workModalOpen, setWorkModalOpen] = useState<boolean>(false);
  const [workRemark, setWorkRemark] = useState<string>('');

  const [resolveModalOpen, setResolveModalOpen] = useState<boolean>(false);
  const [resolutionRemark, setResolutionRemark] = useState<string>('');

  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await dbFetchComplaintById(complaintId);
    setComplaint(data.complaint);
    setUpdates(data.updates);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [complaintId]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">Complaint not found</p>
          <button
            onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'student-dashboard')}
            className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            &larr; Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Handle Admin status transitions
  const handleAccept = async () => {
    if (!user) return;
    const updated = await dbUpdateComplaintStatus(
      complaint.id,
      'Accepted',
      'Complaint accepted by campus administration.',
      user
    );
    if (updated) {
      setComplaint(updated);
      addToast('Complaint Accepted', `Ticket ${complaint.complaint_number} marked as Accepted.`, 'info');
      loadData();
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rejectionReason.trim()) return;

    const updated = await dbUpdateComplaintStatus(
      complaint.id,
      'Rejected',
      'Complaint rejected by administration.',
      user,
      rejectionReason.trim()
    );
    if (updated) {
      setComplaint(updated);
      setRejectModalOpen(false);
      setRejectionReason('');
      addToast('Complaint Rejected', `Ticket ${complaint.complaint_number} rejected with reason.`, 'warning');
      loadData();
    }
  };

  const handleStartWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !workRemark.trim()) return;

    const updated = await dbUpdateComplaintStatus(
      complaint.id,
      'In Progress',
      workRemark.trim(),
      user
    );
    if (updated) {
      setComplaint(updated);
      setWorkModalOpen(false);
      setWorkRemark('');
      addToast('Work Started', `Ticket ${complaint.complaint_number} set to In Progress.`, 'info');
      loadData();
    }
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !resolutionRemark.trim()) return;

    const updated = await dbUpdateComplaintStatus(
      complaint.id,
      'Resolved',
      resolutionRemark.trim(),
      user
    );
    if (updated) {
      setComplaint(updated);
      setResolveModalOpen(false);
      setResolutionRemark('');
      addToast('Complaint Resolved', `Ticket ${complaint.complaint_number} marked as Resolved.`, 'success');
      loadData();
    }
  };

  const handlePriorityChange = async (newPriority: ComplaintPriority) => {
    await dbUpdateComplaintPriority(complaint.id, newPriority);
    setComplaint({ ...complaint, priority: newPriority });
    addToast('Priority Updated', `Priority set to ${newPriority}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Back bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'student-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              {complaint.complaint_number}
            </span>
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Admin Action Bar (if user is Admin) */}
        {isAdmin && (
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Admin Controls
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300">
                Current Status: <strong>{complaint.status}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {complaint.status === 'Pending' && (
                <>
                  <button
                    onClick={handleAccept}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Accept Complaint
                  </button>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Reject Complaint
                  </button>
                </>
              )}

              {complaint.status === 'Accepted' && (
                <button
                  onClick={() => setWorkModalOpen(true)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Start Work
                </button>
              )}

              {complaint.status === 'In Progress' && (
                <button
                  onClick={() => setResolveModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Resolved
                </button>
              )}

              {/* Priority override dropdown */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
                <span className="text-[11px] text-slate-400">Priority:</span>
                <select
                  value={complaint.priority}
                  onChange={(e) =>
                    handlePriorityChange(e.target.value as ComplaintPriority)
                  }
                  className="text-xs bg-slate-800 text-white border border-slate-700 rounded px-2 py-1"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Complaint Details & Image (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {complaint.category} Issue
                  </span>
                  <span>·</span>
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <h1 className="text-xl font-bold text-slate-900 leading-snug">
                  {complaint.description}
                </h1>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Building / Block</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {complaint.building}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Room Number</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Room {complaint.room_number}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Class Identifier</span>
                  <span className="font-mono font-bold text-indigo-700 mt-0.5 block">
                    {complaint.cse_class}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Submitted</span>
                  <span className="font-mono text-slate-700 mt-0.5 block tabular-nums">
                    {formatDate(complaint.created_at)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Last Updated</span>
                  <span className="font-mono text-slate-700 mt-0.5 block tabular-nums">
                    {formatDate(complaint.updated_at)}
                  </span>
                </div>

                {complaint.resolved_at && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Resolved At</span>
                    <span className="font-mono text-emerald-700 font-semibold mt-0.5 block tabular-nums">
                      {formatDate(complaint.resolved_at)}
                    </span>
                  </div>
                )}
              </div>

              {/* Photo Evidence if uploaded */}
              {complaint.image_url ? (
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-2">
                    Photo Evidence Attached by Student
                  </span>
                  <div
                    onClick={() => setImageModalOpen(true)}
                    className="relative rounded-xl overflow-hidden border border-slate-200 group cursor-pointer bg-slate-100 max-h-72"
                  >
                    <img
                      src={complaint.image_url}
                      alt="Complaint Evidence"
                      referrerPolicy="no-referrer"
                      className="w-full h-64 object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                      <ExternalLink className="w-4 h-4" /> Click to enlarge
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                  No photographic evidence was uploaded with this complaint.
                </div>
              )}

              {/* Remarks Banner */}
              {complaint.admin_remark && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    Latest Admin Remark
                  </div>
                  <p className="text-xs text-indigo-950 leading-relaxed">
                    {complaint.admin_remark}
                  </p>
                </div>
              )}

              {complaint.rejection_reason && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs mb-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Rejection Reason
                  </div>
                  <p className="text-xs text-rose-950 leading-relaxed">
                    {complaint.rejection_reason}
                  </p>
                </div>
              )}
            </div>

            {/* Student Information (Admin view) */}
            {isAdmin && complaint.student && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Reporting Student Profile
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name</span>
                    <span className="font-semibold text-slate-800">{complaint.student.full_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">USN / Student ID</span>
                    <span className="font-mono text-slate-800">{complaint.student.student_id || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">College Email</span>
                    <span className="text-indigo-600 font-mono truncate block">{complaint.student.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Branch</span>
                    <span className="text-slate-700">{complaint.student.branch || 'CSE'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Year & Semester</span>
                    <span className="text-slate-700">
                      {complaint.student.year || '3rd Year'}, {complaint.student.semester || 'Sem 5'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">CSE Class</span>
                    <span className="font-mono font-bold text-slate-900">{complaint.cse_class}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Animated Vertical Timeline (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Complaint Lifecycle Timeline
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Real-time audit trail of actions taken
                  </p>
                </div>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>

              <Timeline complaint={complaint} updates={updates} />
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Complaint"
        subtitle="Please provide a clear reason for the student"
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              disabled={!rejectionReason.trim()}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Confirm Rejection
            </button>
          </>
        }
      >
        <form onSubmit={handleRejectSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Rejection *
            </label>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Duplicate report already being addressed, or issue outside campus maintenance scope."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Start Work Modal */}
      <Modal
        isOpen={workModalOpen}
        onClose={() => setWorkModalOpen(false)}
        title="Start Maintenance Work"
        subtitle="Assign technicians and note expected schedule"
        footer={
          <>
            <button
              onClick={() => setWorkModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleStartWorkSubmit}
              disabled={!workRemark.trim()}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Dispatch & Update Status
            </button>
          </>
        }
      >
        <form onSubmit={handleStartWorkSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Work Remark *
            </label>
            <textarea
              required
              rows={3}
              value={workRemark}
              onChange={(e) => setWorkRemark(e.target.value)}
              placeholder="Example: Electrician informed. Team will inspect during lunch break."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Mark Issue as Resolved"
        subtitle="Confirm that the problem has been fully fixed"
        footer={
          <>
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleResolveSubmit}
              disabled={!resolutionRemark.trim()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Complete & Resolve
            </button>
          </>
        }
      >
        <form onSubmit={handleResolveSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resolution Remark *
            </label>
            <textarea
              required
              rows={3}
              value={resolutionRemark}
              onChange={(e) => setResolutionRemark(e.target.value)}
              placeholder="Example: Fan motor replaced and tested. Airflow confirmed."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Image zoom modal */}
      {complaint.image_url && (
        <Modal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          title={`Evidence Photo - ${complaint.complaint_number}`}
          maxWidth="4xl"
          footer={
            <button
              onClick={() => setImageModalOpen(false)}
              className="px-4 py-1.5 text-xs bg-slate-800 text-white rounded-lg"
            >
              Close
            </button>
          }
        >
          <img
            src={complaint.image_url}
            alt="Evidence full view"
            referrerPolicy="no-referrer"
            className="w-full max-h-[70vh] object-contain rounded-lg"
          />
        </Modal>
      )}
    </div>
  );
};
