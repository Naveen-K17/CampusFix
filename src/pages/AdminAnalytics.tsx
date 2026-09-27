import React from 'react';
import { Complaint } from '../types/database';
import { BUILDING_BLOCKS, COMPLAINT_CATEGORIES, STATUS_CONFIG } from '../lib/utils';
import { BarChart3, Clock, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

interface AdminAnalyticsProps {
  complaints: Complaint[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ complaints }) => {
  const total = complaints.length || 1;

  // Breakdown by Block
  const blockCounts = BUILDING_BLOCKS.map((blk) => {
    const count = complaints.filter((c) => c.building === blk).length;
    return { name: blk, count, percentage: Math.round((count / total) * 100) };
  });

  // Breakdown by Category
  const categoryCounts = COMPLAINT_CATEGORIES.map((cat) => {
    const count = complaints.filter((c) => c.category === cat).length;
    return { name: cat, count, percentage: Math.round((count / total) * 100) };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  // Breakdown by Status
  const statusCounts = Object.keys(STATUS_CONFIG).map((st) => {
    const count = complaints.filter((c) => c.status === st).length;
    return { name: st, count, percentage: Math.round((count / total) * 100) };
  });

  // Breakdown by CSE Class
  const classMap: Record<string, number> = {};
  complaints.forEach((c) => {
    classMap[c.cse_class] = (classMap[c.cse_class] || 0) + 1;
  });
  const classBreakdown = Object.entries(classMap)
    .map(([cseClass, count]) => ({ cseClass, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Average resolution time (in hours)
  const resolvedWithTimestamps = complaints.filter((c) => c.status === 'Resolved' && c.resolved_at);
  let avgHours = 0;
  if (resolvedWithTimestamps.length > 0) {
    const totalMs = resolvedWithTimestamps.reduce((acc, c) => {
      const start = new Date(c.created_at).getTime();
      const end = new Date(c.resolved_at!).getTime();
      return acc + (end - start);
    }, 0);
    avgHours = Math.round(totalMs / (resolvedWithTimestamps.length * 3600000));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Campus Maintenance Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time metrics calculated directly from Supabase complaint records
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Total Issues Logged
          </span>
          <p className="text-3xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            {complaints.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across Block A, B & C
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Resolution Efficiency
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono mt-1 tabular-nums">
            {Math.round(
              ((complaints.filter((c) => c.status === 'Resolved').length) / total) * 100
            )}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Complaints successfully fixed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Average Turnaround Time
          </span>
          <p className="text-3xl font-extrabold text-indigo-600 font-mono mt-1 tabular-nums">
            {avgHours > 0 ? `${avgHours}h` : '< 24h'}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            From submission to resolution
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Block Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Complaints by Campus Block
          </h3>
          <div className="space-y-3">
            {blockCounts.map((b) => (
              <div key={b.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{b.name}</span>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {b.count} ({b.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Status Breakdown
          </h3>
          <div className="space-y-3">
            {statusCounts.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{s.name}</span>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {s.count} ({s.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-800 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Complaints by Equipment & Category
          </h3>
          <div className="space-y-2.5">
            {categoryCounts.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700">{c.name}</span>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {c.count} ({c.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active CSE Classes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Top Reporting CSE Classes
          </h3>
          <div className="space-y-2.5">
            {classBreakdown.map((item) => (
              <div
                key={item.cseClass}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-mono font-bold text-indigo-600">
                  {item.cseClass}
                </span>
                <span className="font-mono text-slate-700 font-semibold tabular-nums">
                  {item.count} tickets
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
