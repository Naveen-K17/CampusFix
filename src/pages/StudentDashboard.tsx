import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint, ComplaintStatus } from '../types/database';
import { dbFetchComplaints } from '../lib/supabase';
import { StatCard } from '../components/StatCard';
import { ComplaintCard } from '../components/ComplaintCard';
import { EmptyState } from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileQuestion,
  Filter,
  PlusCircle,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (view: string, id?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadComplaints = async () => {
    if (!user) return;
    setIsLoading(true);
    const data = await dbFetchComplaints(user.id);
    setComplaints(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComplaints();
  }, [user]);

  // Derived statistics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.complaint_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.room_number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || c.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Student Portal
              </span>
              <span>·</span>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                CSE Class: {user?.cse_class || 'CSE-17'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {getGreeting()}, {user?.full_name || 'Student'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {user?.branch || 'Computer Science & Engineering'} · {user?.student_id || 'USN'}
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('report')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report an Issue</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Complaints"
            value={totalCount}
            description="Reported by you"
            active={selectedStatus === 'all'}
            onClick={() => setSelectedStatus('all')}
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            description="Awaiting review"
            highlightColor="text-amber-600"
            icon={<Clock className="w-4 h-4 text-amber-500" />}
            active={selectedStatus === 'Pending'}
            onClick={() => setSelectedStatus('Pending')}
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            description="Active repairs"
            highlightColor="text-purple-600"
            icon={<Wrench className="w-4 h-4 text-purple-500" />}
            active={selectedStatus === 'In Progress'}
            onClick={() => setSelectedStatus('In Progress')}
          />
          <StatCard
            label="Resolved"
            value={resolvedCount}
            description="Fixed & verified"
            highlightColor="text-emerald-600"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            active={selectedStatus === 'Resolved'}
            onClick={() => setSelectedStatus('Resolved')}
          />
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, room, or issue..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-lg">
            {['all', 'Pending', 'Accepted', 'In Progress', 'Resolved', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus.toLowerCase() === st.toLowerCase()
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All Issues' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Your Recent Complaints
            </h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Showing {filtered.length} of {complaints.length}
            </span>
          </div>

          {isLoading ? (
            <CardSkeleton count={3} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={
                searchQuery || selectedStatus !== 'all'
                  ? 'No matching complaints found'
                  : 'You have not reported any issues yet'
              }
              description={
                searchQuery || selectedStatus !== 'all'
                  ? 'Try clearing the search query or status filter to see all your reports.'
                  : 'Notice a broken fan, projector glitch, or classroom issue? Submit your first ticket now.'
              }
              actionText="+ Report an Issue"
              onAction={() => onNavigate('report')}
              icon={<FileQuestion className="w-6 h-6" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((c) => (
                <ComplaintCard
                  key={c.id}
                  complaint={c}
                  onClick={() => onNavigate('complaint-details', c.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
