import React from 'react';
import { Complaint, ComplaintUpdate } from '../types/database';
import { formatDate } from '../lib/utils';
import { CheckCircle2, Clock, Wrench, XCircle, ArrowRightCircle } from 'lucide-react';

interface TimelineProps {
  complaint: Complaint;
  updates: ComplaintUpdate[];
}

export const Timeline: React.FC<TimelineProps> = ({ complaint, updates }) => {
  // Synthesize events that have actually occurred
  interface TimelineEvent {
    id: string;
    stage: string;
    status: string;
    timestamp: string;
    remark?: string | null;
    authorName?: string;
    icon: React.ReactNode;
    color: string;
  }

  const events: TimelineEvent[] = [];

  // Stage 1: Submitted (always occurred)
  events.push({
    id: 'evt-submitted',
    stage: 'Complaint Submitted',
    status: 'Pending',
    timestamp: complaint.created_at,
    remark: `Logged by ${complaint.student?.full_name || 'Student'} (${complaint.cse_class}) for ${complaint.building}, Room ${complaint.room_number}.`,
    authorName: complaint.student?.full_name || 'Student',
    icon: <Clock className="w-4 h-4 text-amber-500" />,
    color: 'border-amber-500 bg-amber-50',
  });

  // Collect subsequent stages from complaint_updates or complaint state
  const reviewUpdate = updates.find((u) => u.status === 'Accepted' || u.status === 'Rejected');
  const inProgressUpdate = updates.find((u) => u.status === 'In Progress');
  const resolvedUpdate = updates.find((u) => u.status === 'Resolved');

  if (complaint.status === 'Rejected') {
    events.push({
      id: 'evt-rejected',
      stage: 'Complaint Rejected',
      status: 'Rejected',
      timestamp: reviewUpdate?.created_at || complaint.updated_at,
      remark: complaint.rejection_reason || reviewUpdate?.remark || 'Issue could not be validated.',
      authorName: reviewUpdate?.updater?.full_name || 'Administration',
      icon: <XCircle className="w-4 h-4 text-rose-500" />,
      color: 'border-rose-500 bg-rose-50',
    });
  } else {
    // If Accepted or higher
    if (
      complaint.status === 'Accepted' ||
      complaint.status === 'In Progress' ||
      complaint.status === 'Resolved' ||
      reviewUpdate
    ) {
      events.push({
        id: 'evt-accepted',
        stage: 'Complaint Accepted',
        status: 'Accepted',
        timestamp: reviewUpdate?.created_at || complaint.updated_at,
        remark: reviewUpdate?.remark || complaint.admin_remark || 'Issue verified and queued for maintenance.',
        authorName: reviewUpdate?.updater?.full_name || 'Administration',
        icon: <ArrowRightCircle className="w-4 h-4 text-blue-500" />,
        color: 'border-blue-500 bg-blue-50',
      });
    }

    // If In Progress or Resolved
    if (
      complaint.status === 'In Progress' ||
      complaint.status === 'Resolved' ||
      inProgressUpdate
    ) {
      events.push({
        id: 'evt-work-started',
        stage: 'Work Started',
        status: 'In Progress',
        timestamp: inProgressUpdate?.created_at || complaint.updated_at,
        remark: inProgressUpdate?.remark || complaint.admin_remark || 'Maintenance technician dispatched to site.',
        authorName: inProgressUpdate?.updater?.full_name || 'Maintenance Team',
        icon: <Wrench className="w-4 h-4 text-purple-500" />,
        color: 'border-purple-500 bg-purple-50',
      });
    }

    // If Resolved
    if (complaint.status === 'Resolved' || complaint.resolved_at) {
      events.push({
        id: 'evt-resolved',
        stage: 'Problem Fixed & Resolved',
        status: 'Resolved',
        timestamp: complaint.resolved_at || resolvedUpdate?.created_at || complaint.updated_at,
        remark: complaint.admin_remark || resolvedUpdate?.remark || 'Repairs completed and campus facility tested.',
        authorName: resolvedUpdate?.updater?.full_name || 'Campus Maintenance Supervisor',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        color: 'border-emerald-500 bg-emerald-50',
      });
    }
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((event, idx) => (
        <div key={event.id} className="relative group">
          {/* Node icon circle */}
          <div
            className={`absolute -left-6 top-0.5 flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white ${event.color} transition-transform group-hover:scale-110`}
          >
            {event.icon}
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 transition-shadow hover:shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <span className="text-sm font-semibold text-slate-900">
                {event.stage}
              </span>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {formatDate(event.timestamp)}
              </span>
            </div>

            {event.remark && (
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                {event.remark}
              </p>
            )}

            {event.authorName && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Updated by: <strong className="font-medium text-slate-700">{event.authorName}</strong></span>
                <span className="text-[10px] text-slate-400">Step {idx + 1} of {events.length}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
