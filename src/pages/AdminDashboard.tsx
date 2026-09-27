import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types/database';
import {
  dbFetchComplaints,
  dbUpdateComplaintStatus,
  dbUpdateComplaintPriority,
} from '../lib/supabase';
import { Sidebar } from '../components/Sidebar';
import { StatCard } from '../components/StatCard';
import { ComplaintTable } from '../components/ComplaintTable';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminManagement } from './AdminManagement';
import { Settings } from './Settings';
import {
  BUILDING_BLOCKS,
  COMPLAINT_CATEGORIES,
  CSE_CLASSES,
} from '../lib/utils';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  Search,
  Shield,
  Wrench,
  XCircle,
  FileQuestion,
  Menu,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string, id?: string) => void;
  onOpenSQLModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenSQLModal,
}) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Modals for actions
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const [workModalOpen, setWorkModalOpen] = useState<boolean>(false);
  const [workRemark, setWorkRemark] = useState<string>('');

  const [resolveModalOpen, setResolveModalOpen] = useState<boolean>(false);
  const [resolutionRemark, setResolutionRemark] = useState<string>('');

  // Access check
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Admin Access Denied
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Admin access has not been granted to this account.
          </p>
          <button
            onClick={() => onNavigate('student-dashboard')}
            className="mt-5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
          >
            Back to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  const loadData = async () => {
    setIsLoading(true);
    const data = await dbFetchComplaints();
    setComplaints(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute counts
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const acceptedCount = complaints.filter((c) => c.status === 'Accepted').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const rejectedCount = complaints.filter((c) => c.status === 'Rejected').length;

  // Filtered dataset
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Tab filter
      if (
        activeTab !== 'dashboard' &&
        activeTab !== 'all' &&
        activeTab !== 'analytics' &&
        activeTab !== 'admin-management' &&
        activeTab !== 'settings'
      ) {
        if (c.status !== activeTab) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = c.complaint_number.toLowerCase().includes(query);
        const matchesStudent = c.student?.full_name?.toLowerCase().includes(query);
        const matchesUsn = c.student?.student_id?.toLowerCase().includes(query);
        const matchesRoom = c.room_number.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);

        if (!matchesId && !matchesStudent && !matchesUsn && !matchesRoom && !matchesDesc) {
          return false;
        }
      }

      // Dropdown filters
      if (filterBlock !== 'all' && c.building !== filterBlock) return false;
      if (filterCategory !== 'all' && c.category !== filterCategory) return false;
      if (filterPriority !== 'all' && c.priority !== filterPriority) return false;
      if (filterClass !== 'all' && c.cse_class !== filterClass) return false;

      return true;
    });
  }, [
    complaints,
    activeTab,
    searchQuery,
    filterBlock,
    filterCategory,
    filterPriority,
    filterClass,
  ]);

  // Actions
  const handleAccept = async (c: Complaint) => {
    if (!user) return;
    const updated = await dbUpdateComplaintStatus(
      c.id,
      'Accepted',
      'Complaint accepted by campus administration.',
      user
    );
    if (updated) {
      setComplaints((prev) => prev.map((item) => (item.id === c.id ? updated : item)));
      addToast('Complaint Accepted', `Ticket ${c.complaint_number} accepted.`, 'info');
    }
  };

  const handleOpenReject = (c: Complaint) => {
    setActiveComplaint(c);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeComplaint || !rejectionReason.trim()) return;

    const updated = await dbUpdateComplaintStatus(
      activeComplaint.id,
      'Rejected',
      'Complaint rejected by administration.',
      user,
      rejectionReason.trim()
    );

    if (updated) {
      setComplaints((prev) =>
        prev.map((item) => (item.id === activeComplaint.id ? updated : item))
      );
      setRejectModalOpen(false);
      addToast('Complaint Rejected', `Ticket ${activeComplaint.complaint_number} rejected.`, 'warning');
    }
  };

  const handleOpenWork = (c: Complaint) => {
    setActiveComplaint(c);
    setWorkRemark('');
    setWorkModalOpen(true);
  };

  const handleWorkConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeComplaint || !workRemark.trim()) return;

    const updated = await dbUpdateComplaintStatus(
      activeComplaint.id,
      'In Progress',
      workRemark.trim(),
      user
    );

    if (updated) {
      setComplaints((prev) =>
        prev.map((item) => (item.id === activeComplaint.id ? updated : item))
      );
      setWorkModalOpen(false);
      addToast('Work Started', `Ticket ${activeComplaint.complaint_number} set to In Progress.`, 'info');
    }
  };

  const handleOpenResolve = (c: Complaint) => {
    setActiveComplaint(c);
    setResolutionRemark('');
    setResolveModalOpen(true);
  };

  const handleResolveConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeComplaint || !resolutionRemark.trim()) return;

    const updated = await dbUpdateComplaintStatus(
      activeComplaint.id,
      'Resolved',
      resolutionRemark.trim(),
      user
    );

    if (updated) {
      setComplaints((prev) =>
        prev.map((item) => (item.id === activeComplaint.id ? updated : item))
      );
      setResolveModalOpen(false);
      addToast('Complaint Resolved', `Ticket ${activeComplaint.complaint_number} resolved.`, 'success');
    }
  };

  const handleChangePriority = async (c: Complaint, priority: ComplaintPriority) => {
    await dbUpdateComplaintPriority(c.id, priority);
    setComplaints((prev) =>
      prev.map((item) => (item.id === c.id ? { ...item, priority } : item))
    );
    addToast('Priority Changed', `${c.complaint_number} set to ${priority}`, 'info');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterBlock('all');
    setFilterCategory('all');
    setFilterPriority('all');
    setFilterClass('all');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          currentTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          pendingCount={pendingCount}
          onOpenSQLModal={onOpenSQLModal}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-slate-900">
            <Sidebar
              currentTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              pendingCount={pendingCount}
              onOpenSQLModal={() => {
                setMobileSidebarOpen(false);
                onOpenSQLModal();
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight capitalize">
                {activeTab === 'dashboard'
                  ? 'Administration Dashboard'
                  : activeTab === 'all'
                  ? 'All Campus Complaints'
                  : activeTab === 'analytics'
                  ? 'Analytics'
                  : activeTab === 'admin-management'
                  ? 'Admin Access & Governance'
                  : activeTab === 'settings'
                  ? 'Settings'
                  : `${activeTab} Complaints`}
              </h1>
              <p className="text-[11px] text-slate-500">
                Sapthagiri NPS University · Maintenance Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh data"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Routing */}
        <div className="p-4 sm:p-8 space-y-6 flex-1">
          {activeTab === 'analytics' ? (
            <AdminAnalytics complaints={complaints} />
          ) : activeTab === 'admin-management' ? (
            <AdminManagement />
          ) : activeTab === 'settings' ? (
            <Settings onOpenSQLModal={onOpenSQLModal} />
          ) : (
            <>
              {/* Statistics Row (Shown on Dashboard or Status views) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard
                  label="Total"
                  value={totalCount}
                  active={activeTab === 'dashboard' || activeTab === 'all'}
                  onClick={() => setActiveTab('all')}
                />
                <StatCard
                  label="Pending"
                  value={pendingCount}
                  highlightColor="text-amber-600"
                  active={activeTab === 'Pending'}
                  onClick={() => setActiveTab('Pending')}
                />
                <StatCard
                  label="Accepted"
                  value={acceptedCount}
                  highlightColor="text-blue-600"
                  active={activeTab === 'Accepted'}
                  onClick={() => setActiveTab('Accepted')}
                />
                <StatCard
                  label="In Progress"
                  value={inProgressCount}
                  highlightColor="text-purple-600"
                  active={activeTab === 'In Progress'}
                  onClick={() => setActiveTab('In Progress')}
                />
                <StatCard
                  label="Resolved"
                  value={resolvedCount}
                  highlightColor="text-emerald-600"
                  active={activeTab === 'Resolved'}
                  onClick={() => setActiveTab('Resolved')}
                />
                <StatCard
                  label="Rejected"
                  value={rejectedCount}
                  highlightColor="text-rose-600"
                  active={activeTab === 'Rejected'}
                  onClick={() => setActiveTab('Rejected')}
                />
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  {/* Search */}
                  <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ID, student name, USN, room, or issue..."
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Clear filters button */}
                  {(searchQuery ||
                    filterBlock !== 'all' ||
                    filterCategory !== 'all' ||
                    filterPriority !== 'all' ||
                    filterClass !== 'all') && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                {/* Dropdown Filters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
                  {/* Block */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Campus Block
                    </label>
                    <select
                      value={filterBlock}
                      onChange={(e) => setFilterBlock(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <option value="all">All Blocks (A, B, C)</option>
                      {BUILDING_BLOCKS.map((blk) => (
                        <option key={blk} value={blk}>
                          {blk}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <option value="all">All Categories</option>
                      {COMPLAINT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <option value="all">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* CSE Class */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      CSE Class
                    </label>
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono"
                    >
                      <option value="all">All Classes (CSE-1 to 50)</option>
                      {CSE_CLASSES.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Complaints Table / Results */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Complaint Queue
                  </span>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {filteredComplaints.length} tickets matching criteria
                  </span>
                </div>

                {isLoading ? (
                  <TableSkeleton rows={6} />
                ) : filteredComplaints.length === 0 ? (
                  <EmptyState
                    title="No complaints found"
                    description="No tickets match the selected filters or search parameters."
                    actionText="Reset Filters"
                    onAction={resetFilters}
                    icon={<FileQuestion className="w-6 h-6" />}
                  />
                ) : (
                  <ComplaintTable
                    complaints={filteredComplaints}
                    onView={(c) => onNavigate('complaint-details', c.id)}
                    onAccept={handleAccept}
                    onReject={handleOpenReject}
                    onStartWork={handleOpenWork}
                    onResolve={handleOpenResolve}
                    onChangePriority={handleChangePriority}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Complaint"
        subtitle={`Ticket ${activeComplaint?.complaint_number || ''}`}
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Confirm Rejection
            </button>
          </>
        }
      >
        <form onSubmit={handleRejectConfirm} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Rejection *
            </label>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Issue resolved prior to inspection, or duplicate ticket."
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
        subtitle={`Ticket ${activeComplaint?.complaint_number || ''}`}
        footer={
          <>
            <button
              onClick={() => setWorkModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleWorkConfirm}
              disabled={!workRemark.trim()}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Dispatch & Update Status
            </button>
          </>
        }
      >
        <form onSubmit={handleWorkConfirm} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Work Remark *
            </label>
            <textarea
              required
              rows={3}
              value={workRemark}
              onChange={(e) => setWorkRemark(e.target.value)}
              placeholder="Example: Electrician has been informed. Inspection scheduled."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Mark Resolved Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Mark Issue as Resolved"
        subtitle={`Ticket ${activeComplaint?.complaint_number || ''}`}
        footer={
          <>
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleResolveConfirm}
              disabled={!resolutionRemark.trim()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Confirm & Resolve
            </button>
          </>
        }
      >
        <form onSubmit={handleResolveConfirm} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resolution Remark *
            </label>
            <textarea
              required
              rows={3}
              value={resolutionRemark}
              onChange={(e) => setResolutionRemark(e.target.value)}
              placeholder="Example: Fan motor replaced and tested."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
