import React from 'react';
import { Complaint } from '../types/database';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate } from '../lib/utils';
import { ArrowRight, Building, MapPin } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-4 transition-all hover:border-indigo-300 hover:shadow-sm cursor-pointer group text-left"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          {complaint.complaint_number}
        </span>
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} size="sm" />
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {complaint.category}: {complaint.description}
      </h3>

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-y-1">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            {complaint.building}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Room {complaint.room_number}
          </span>
          <span className="text-[11px] font-mono text-indigo-600 bg-slate-100 px-1.5 py-0.5 rounded">
            {complaint.cse_class}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {formatDate(complaint.created_at)}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};
