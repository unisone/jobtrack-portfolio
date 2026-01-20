/**
 * Centralized Status Configuration for Job Hunt Tracker
 *
 * Single source of truth for all job status styling, labels, and metadata.
 * This replaces the scattered status definitions across multiple files.
 */

import {
  Bookmark,
  Send,
  Phone,
  Users,
  Code2,
  Trophy,
  Gift,
  CheckCircle2,
  XCircle,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import type { JobStatus } from '@/types';

export interface StatusConfig {
  /** Human-readable label */
  label: string;
  /** Short description for tooltips */
  description: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Badge styling with dark mode support */
  badge: {
    bg: string;
    text: string;
    dot: string;
  };
  /** Chart color (CSS variable or oklch) */
  chart: string;
  /** Sort order in pipeline */
  order: number;
  /** Category for filtering */
  category: 'saved' | 'active' | 'terminal';
}

/**
 * Complete status configuration for all job statuses.
 *
 * Usage:
 * - Badge styling: STATUS_CONFIG[status].badge
 * - Chart colors: STATUS_CONFIG[status].chart
 * - Icons: STATUS_CONFIG[status].icon
 * - Labels: STATUS_CONFIG[status].label
 */
export const STATUS_CONFIG: Record<JobStatus, StatusConfig> = {
  saved: {
    label: 'Saved',
    description: 'Bookmarked for later review',
    icon: Bookmark,
    badge: {
      bg: 'bg-secondary',
      text: 'text-secondary-foreground',
      dot: 'bg-muted-foreground',
    },
    chart: 'var(--muted-foreground)',
    order: 0,
    category: 'saved',
  },
  applied: {
    label: 'Applied',
    description: 'Application submitted',
    icon: Send,
    badge: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      dot: 'bg-primary',
    },
    chart: 'var(--primary)',
    order: 1,
    category: 'active',
  },
  screening: {
    label: 'Screening',
    description: 'Initial recruiter call',
    icon: Phone,
    badge: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
    chart: 'oklch(0.7 0.15 85)',
    order: 2,
    category: 'active',
  },
  interview: {
    label: 'Interview',
    description: 'Behavioral/culture interview',
    icon: Users,
    badge: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-600 dark:text-orange-400',
      dot: 'bg-orange-500',
    },
    chart: 'oklch(0.65 0.18 45)',
    order: 3,
    category: 'active',
  },
  technical: {
    label: 'Technical',
    description: 'Technical assessment or interview',
    icon: Code2,
    badge: {
      bg: 'bg-violet-500/10',
      text: 'text-violet-600 dark:text-violet-400',
      dot: 'bg-violet-500',
    },
    chart: 'oklch(0.55 0.2 290)',
    order: 4,
    category: 'active',
  },
  final: {
    label: 'Final Round',
    description: 'Final interviews with leadership',
    icon: Trophy,
    badge: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
      dot: 'bg-indigo-500',
    },
    chart: 'var(--chart-4)',
    order: 5,
    category: 'active',
  },
  offer: {
    label: 'Offer',
    description: 'Offer received, pending decision',
    icon: Gift,
    badge: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-500 animate-pulse',
    },
    chart: 'oklch(0.6 0.18 145)',
    order: 6,
    category: 'active',
  },
  accepted: {
    label: 'Accepted',
    description: 'Offer accepted, job secured!',
    icon: CheckCircle2,
    badge: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
    chart: 'oklch(0.55 0.2 145)',
    order: 7,
    category: 'terminal',
  },
  rejected: {
    label: 'Rejected',
    description: 'Application not moving forward',
    icon: XCircle,
    badge: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      dot: 'bg-destructive',
    },
    chart: 'var(--destructive)',
    order: 8,
    category: 'terminal',
  },
  withdrawn: {
    label: 'Withdrawn',
    description: 'You withdrew from the process',
    icon: LogOut,
    badge: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      dot: 'bg-muted-foreground',
    },
    chart: 'var(--muted-foreground)',
    order: 9,
    category: 'terminal',
  },
};

/**
 * All statuses in pipeline order
 */
export const STATUS_ORDER: JobStatus[] = [
  'saved',
  'applied',
  'screening',
  'interview',
  'technical',
  'final',
  'offer',
  'accepted',
  'rejected',
  'withdrawn',
];

/**
 * Active interview stages (for calculating "interviewing" count)
 */
export const INTERVIEW_STATUSES: JobStatus[] = [
  'screening',
  'interview',
  'technical',
  'final',
];

/**
 * Terminal statuses (job is no longer active)
 */
export const TERMINAL_STATUSES: JobStatus[] = [
  'accepted',
  'rejected',
  'withdrawn',
];

/**
 * Statuses that count toward pipeline (not saved/terminal)
 */
export const ACTIVE_STATUSES: JobStatus[] = [
  'applied',
  'screening',
  'interview',
  'technical',
  'final',
  'offer',
];

/**
 * Get status config safely with fallback
 */
export function getStatusConfig(status: JobStatus): StatusConfig {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.saved;
}

/**
 * Get sorted statuses for dropdowns/selects
 */
export function getStatusOptions(): { value: JobStatus; label: string }[] {
  return STATUS_ORDER.map((status) => ({
    value: status,
    label: STATUS_CONFIG[status].label,
  }));
}
