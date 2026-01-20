/**
 * Supabase exports
 *
 * Usage:
 * import { createClient, fetchJobs, createJob, ... } from '@/lib/supabase'
 */

// Client
export { createClient } from './client';

// Services - Jobs
export {
  fetchJobs,
  fetchJobById,
  createJob,
  updateJob,
  deleteJob,
  fetchJobStats,
  batchUpdateJobs,
  batchDeleteJobs,
} from './services';

// Services - Profile
export { fetchProfile, upsertProfile } from './services';

// Services - Notes
export {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from './services';

// Services - Activities
export {
  logActivity,
  fetchActivities,
  fetchActivityCounts,
} from './services';

// Services - Auth Helpers
export { getCurrentUserId, getCurrentUser } from './services';

// Services - Real-time
export { subscribeToJobs, subscribeToActivities } from './services';

// Types
export type {
  ServiceResult,
  ServiceError,
  FetchJobsOptions,
  FetchNotesOptions,
  FetchActivitiesOptions,
  LogActivityParams,
} from './services';
