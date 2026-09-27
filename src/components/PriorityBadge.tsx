import React from 'react';
import { ComplaintPriority } from '../types/database';
import { PRIORITY_CONFIG } from '../lib/utils';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;

  const renderIcon = () => {
    switch (priority) {
      case 'Critical':
        return <AlertTriangle className="w-3 h-3 shrink-0 text-rose-600" />;
      case 'High':
        return <ArrowUp className="w-3 h-3 shrink-0 text-orange-600" />;
      case 'Medium':
        return <AlertCircle className="w-3 h-3 shrink-0 text-amber-600" />;
      case 'Low':
        return <ArrowDown className="w-3 h-3 shrink-0 text-sky-600" />;
    }
  };

  return (
    <span
      title={config.description}
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${config.badgeClass}`}
    >
      {showIcon && renderIcon()}
      <span>{config.label}</span>
    </span>
  );
};
