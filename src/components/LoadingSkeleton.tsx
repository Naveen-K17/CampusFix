import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-pulse">
      <div className="h-10 bg-slate-50 px-4 flex items-center gap-4">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-4 bg-slate-200 rounded w-32" />
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-4 bg-slate-200 rounded w-16" />
        <div className="h-4 bg-slate-200 rounded w-24 ml-auto" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 px-4 flex items-center gap-4">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-4 bg-slate-100 rounded w-40" />
          <div className="h-4 bg-slate-100 rounded w-16" />
          <div className="h-4 bg-slate-100 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-24 ml-auto" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-3 bg-slate-100 rounded w-20" />
            <div className="h-6 bg-slate-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
