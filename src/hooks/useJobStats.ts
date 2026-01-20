/**
 * Job Statistics Hook
 *
 * Centralized hook for computing job statistics.
 * Replaces duplicated calculations in app-sidebar.tsx and page.tsx.
 */

import { useMemo } from 'react';
import { useJobStore } from '@/lib/store';
import { INTERVIEW_STATUSES } from '@/lib/status';
import { isWithinCurrentWeek } from '@/lib/date-utils';
import type { Job, JobStatus, JobStats } from '@/types';

/**
 * Extended stats including all computed metrics
 */
export interface ExtendedJobStats extends JobStats {
  /** Jobs saved but not applied */
  saved: number;
  /** Jobs currently in any interview stage */
  interviewing: number;
  /** Jobs with offer or accepted */
  offers: number;
  /** Jobs in terminal rejected state */
  rejected: number;
  /** Jobs where user withdrew */
  withdrawn: number;
  /** Percentage of applications that got any response */
  response_rate: number;
  /** Jobs applied within the current week */
  appliedThisWeek: number;
  /** Count by status for charts */
  byStatus: Record<JobStatus, number>;
}

/**
 * Count jobs by status
 */
function countByStatus(jobs: Job[]): Record<JobStatus, number> {
  const counts: Record<JobStatus, number> = {
    saved: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    technical: 0,
    final: 0,
    offer: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  };

  jobs.forEach((job) => {
    counts[job.status]++;
  });

  return counts;
}

/**
 * Compute response rate (percentage of applications that got a response)
 */
function computeResponseRate(jobs: Job[]): number {
  const appliedOrBeyond = jobs.filter((j) => j.status !== 'saved').length;
  if (appliedOrBeyond === 0) return 0;

  const gotResponse = jobs.filter((j) =>
    ['screening', 'interview', 'technical', 'final', 'offer', 'accepted', 'rejected'].includes(
      j.status
    )
  ).length;

  return Math.round((gotResponse / appliedOrBeyond) * 100);
}

/**
 * Count jobs applied within the current week
 */
function countAppliedThisWeek(jobs: Job[]): number {
  return jobs.filter((j) => {
    if (!j.applied_date) return false;
    return isWithinCurrentWeek(new Date(j.applied_date));
  }).length;
}

/**
 * Hook to compute job statistics
 *
 * @example
 * ```tsx
 * const { total, interviewing, offers, response_rate } = useJobStats();
 * ```
 */
export function useJobStats(): ExtendedJobStats {
  const jobs = useJobStore((state) => state.jobs);

  return useMemo(() => {
    const byStatus = countByStatus(jobs);

    const total = jobs.length;
    const saved = byStatus.saved;
    const applied = byStatus.applied;
    const interviewing = INTERVIEW_STATUSES.reduce((sum, s) => sum + byStatus[s], 0);
    const offers = byStatus.offer + byStatus.accepted;
    const rejected = byStatus.rejected;
    const withdrawn = byStatus.withdrawn;
    const response_rate = computeResponseRate(jobs);
    const appliedThisWeek = countAppliedThisWeek(jobs);

    return {
      total,
      saved,
      applied,
      interviewing,
      offers,
      rejected,
      withdrawn,
      response_rate,
      appliedThisWeek,
      byStatus,
    };
  }, [jobs]);
}

/**
 * Lightweight stats hook for sidebar badges
 * Returns only the most essential metrics
 */
export function useSidebarStats() {
  const jobs = useJobStore((state) => state.jobs);

  return useMemo(
    () => ({
      total: jobs.length,
      applied: jobs.filter((j) => j.status === 'applied').length,
      interviewing: jobs.filter((j) => INTERVIEW_STATUSES.includes(j.status)).length,
      offers: jobs.filter((j) => ['offer', 'accepted'].includes(j.status)).length,
    }),
    [jobs]
  );
}
