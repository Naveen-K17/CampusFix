import { BuildingBlock, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../types/database';

// Exactly 50 CSE Classes: CSE-1 to CSE-50
export const CSE_CLASSES: string[] = Array.from({ length: 50 }, (_, i) => `CSE-${i + 1}`);

// Only Block A, Block B, Block C
export const BUILDING_BLOCKS: BuildingBlock[] = ['Block A', 'Block B', 'Block C'];

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  'Fan',
  'Electrical',
  'Lighting',
  'Projector',
  'Furniture',
  'Wi-Fi / Internet',
  'Plumbing',
  'Cleanliness',
  'Laboratory Equipment',
  'Door / Window',
  'Other',
];

export const PRIORITY_CONFIG: Record<
  ComplaintPriority,
  { label: string; description: string; color: string; badgeClass: string }
> = {
  Low: {
    label: 'Low',
    description: 'Minor issue',
    color: '#0284c7',
    badgeClass: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  Medium: {
    label: 'Medium',
    description: 'Normal maintenance issue',
    color: '#ca8a04',
    badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  High: {
    label: 'High',
    description: 'Issue significantly affecting the class',
    color: '#ea580c',
    badgeClass: 'text-orange-700 bg-orange-50 border-orange-200',
  },
  Critical: {
    label: 'Critical',
    description: 'Urgent safety-related issue',
    color: '#dc2626',
    badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
  },
};

export const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; dotColor: string; badgeClass: string; stepIndex: number }
> = {
  Pending: {
    label: 'Pending',
    dotColor: '#eab308',
    badgeClass: 'text-amber-800 bg-amber-50 border-amber-200/80',
    stepIndex: 0,
  },
  Accepted: {
    label: 'Accepted',
    dotColor: '#3b82f6',
    badgeClass: 'text-blue-800 bg-blue-50 border-blue-200/80',
    stepIndex: 1,
  },
  'In Progress': {
    label: 'In Progress',
    dotColor: '#8b5cf6',
    badgeClass: 'text-purple-800 bg-purple-50 border-purple-200/80',
    stepIndex: 2,
  },
  Resolved: {
    label: 'Resolved',
    dotColor: '#10b981',
    badgeClass: 'text-emerald-800 bg-emerald-50 border-emerald-200/80',
    stepIndex: 3,
  },
  Rejected: {
    label: 'Rejected',
    dotColor: '#ef4444',
    badgeClass: 'text-rose-800 bg-rose-50 border-rose-200/80',
    stepIndex: -1,
  },
};

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return '';
  }
}

export function generateComplaintNumber(count: number = 1): string {
  const year = new Date().getFullYear();
  const padded = String(count).padStart(4, '0');
  return `CMP-${year}-${padded}`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
