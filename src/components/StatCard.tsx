import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  highlightColor?: string;
  onClick?: () => void;
  active?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  description,
  icon,
  highlightColor = 'text-slate-900',
  onClick,
  active,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all text-left ${
        onClick ? 'cursor-pointer hover:border-slate-400 hover:shadow-sm' : ''
      } ${
        active
          ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600/20'
          : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
          {label}
        </span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-2xl font-bold tracking-tight tabular-nums ${highlightColor}`}>
          {value}
        </span>
      </div>

      {description && (
        <p className="mt-1 text-xs text-slate-500 leading-normal line-clamp-1">
          {description}
        </p>
      )}
    </div>
  );
};
