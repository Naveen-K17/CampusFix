import React from 'react';
import { ComplaintStatus } from '../types/database';
import { STATUS_CONFIG } from '../lib/utils';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md transition-colors ${
        config.badgeClass
      } ${isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.dotColor }}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  );
};
