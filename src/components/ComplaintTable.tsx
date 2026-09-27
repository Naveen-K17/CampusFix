import React from 'react';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../types/database';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate } from '../lib/utils';
import { Eye, Check, X, Wrench, CheckCircle2, MoreHorizontal } from 'lucide-react';

interface ComplaintTableProps {
  complaints: Complaint[];
  onView: (complaint: Complaint) => void;
  onAccept: (complaint: Complaint) => void;
  onReject: (complaint: Complaint) => void;
  onStartWork: (complaint: Complaint) => void;
  onResolve: (complaint: Complaint) => void;
  onChangePriority: (complaint: Complaint, priority: ComplaintPriority) => void;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  onView,
  onAccept,
  onReject,
  onStartWork,
  onResolve,
  onChangePriority,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Complaint ID</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Reported</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {complaints.map((c) => {
              const isPending = c.status === 'Pending';
              const isAccepted = c.status === 'Accepted';
              const isInProgress = c.status === 'In Progress';

              return (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onView(c)}
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                    {c.complaint_number}
                  </td>

                  {/* Student */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 leading-tight">
                      {c.student?.full_name || 'Student'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {c.student?.student_id || 'USN N/A'}
                    </p>
                  </td>

                  {/* Class */}
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {c.cse_class}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-slate-900">{c.building}</span>
                    <span className="text-slate-400 mx-1">·</span>
                    <span className="text-slate-600">Rm {c.room_number}</span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {c.category}
                  </td>

                  {/* Priority dropdown / badge */}
                  <td
                    className="py-3.5 px-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={c.priority}
                      onChange={(e) =>
                        onChangePriority(c, e.target.value as ComplaintPriority)
                      }
                      className="text-xs bg-transparent border-0 font-medium text-slate-700 cursor-pointer focus:ring-0 rounded py-0.5 pr-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono tabular-nums whitespace-nowrap text-[11px]">
                    {formatDate(c.created_at)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={c.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(c)}
                        title="View Details"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isPending && (
                        <>
                          <button
                            onClick={() => onAccept(c)}
                            title="Accept Complaint"
                            className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onReject(c)}
                            title="Reject Complaint"
                            className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() => onStartWork(c)}
                          title="Start Repair Work"
                          className="px-2 py-1 text-[11px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-600 hover:text-white rounded border border-purple-200 transition-colors flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3" />
                          Start Work
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          onClick={() => onResolve(c)}
                          title="Mark Resolved"
                          className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded border border-emerald-200 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
