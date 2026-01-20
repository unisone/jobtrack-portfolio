/**
 * Supabase Service Layer for Job Hunt Tracker
 *
 * Provides typed service functions for all database operations.
 * All functions return { data, error } pattern for consistent error handling.
 */

import { createClient } from './client';
import type {
  DbJob,
  DbJobInsert,
  DbJobUpdate,
  DbProfile,
  DbProfileInsert,
  DbNote,
  DbNoteInsert,
  DbActivity,
  DbActivityInsert,
  Json,
} from '@/types/database';
import type { Job, UserProfile, Note, JobStatus, JobType, Priority } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
}

export interface ServiceError {
  message: string;
  code?: string;
  details?: string;
}

export interface FetchJobsOptions {
  status?: JobStatus;
  priority?: Priority;
  limit?: number;
  offset?: number;
  orderBy?: keyof DbJob;
  orderDirection?: 'asc' | 'desc';
  search?: string;
}

export interface FetchNotesOptions {
  jobId?: string;
  type?: 'general' | 'interview' | 'research' | 'follow-up';
  limit?: number;
  offset?: number;
}

export interface FetchActivitiesOptions {
  jobId?: string;
  action?: string;
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the current authenticated user's ID
 * @returns The user ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

/**
 * Get the current authenticated user
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return { data: null, error: { message: error.message, code: error.name } };
  }

  return { data: user, error: null };
}

/**
 * Create a standardized error response
 */
function createError(message: string, code?: string, details?: string): ServiceError {
  return { message, code, details };
}

/**
 * Sanitize search input for safe use in LIKE patterns
 * Escapes special characters: %, _, \
 * Also removes null bytes and limits length
 */
function sanitizeSearchInput(input: string): string {
  // Limit length to prevent abuse
  const MAX_SEARCH_LENGTH = 100;
  let sanitized = input.slice(0, MAX_SEARCH_LENGTH);

  // Remove null bytes (security concern)
  sanitized = sanitized.replace(/\0/g, '');

  // Escape LIKE pattern special characters
  // Order matters: escape backslash first, then % and _
  sanitized = sanitized
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');

  return sanitized.trim();
}

/**
 * Transform database job to application Job type
 */
function transformDbJobToJob(dbJob: DbJob): Job {
  return {
    id: dbJob.id,
    created_at: dbJob.created_at || new Date().toISOString(),
    updated_at: dbJob.updated_at || new Date().toISOString(),
    user_id: dbJob.user_id || '',
    company: dbJob.company,
    company_url: dbJob.company_url || undefined,
    company_logo: dbJob.company_logo || undefined,
    title: dbJob.title,
    description: dbJob.description || undefined,
    job_url: dbJob.job_url || undefined,
    job_type: (dbJob.job_type as JobType) || 'remote',
    location: dbJob.location || undefined,
    salary_min: dbJob.salary_min || undefined,
    salary_max: dbJob.salary_max || undefined,
    salary_currency: dbJob.salary_currency || 'USD',
    status: (dbJob.status as JobStatus) || 'saved',
    priority: (dbJob.priority as Priority) || 'medium',
    applied_date: dbJob.applied_date || undefined,
    recruiter_name: dbJob.recruiter_name || undefined,
    recruiter_email: dbJob.recruiter_email || undefined,
    recruiter_phone: dbJob.recruiter_phone || undefined,
    hiring_manager: dbJob.hiring_manager || undefined,
    notes: dbJob.notes || undefined,
    interview_notes: dbJob.interview_notes || undefined,
    next_action: dbJob.next_action || undefined,
    next_action_date: dbJob.next_action_date || undefined,
    source: dbJob.source || undefined,
    referral_name: dbJob.referral_name || undefined,
  };
}

/**
 * Transform database profile to application UserProfile type
 */
function transformDbProfileToProfile(dbProfile: DbProfile): UserProfile {
  return {
    id: dbProfile.id,
    created_at: dbProfile.created_at || new Date().toISOString(),
    updated_at: dbProfile.updated_at || new Date().toISOString(),
    full_name: dbProfile.full_name || '',
    email: dbProfile.email || '',
    phone: dbProfile.phone || undefined,
    location: dbProfile.location || undefined,
    linkedin_url: dbProfile.linkedin_url || undefined,
    github_url: dbProfile.github_url || undefined,
    portfolio_url: dbProfile.portfolio_url || undefined,
    target_roles: dbProfile.target_roles || [],
    target_salary_min: dbProfile.target_salary_min || undefined,
    target_salary_max: dbProfile.target_salary_max || undefined,
    preferred_job_type: (dbProfile.preferred_job_type as JobType[]) || ['remote'],
    willing_to_relocate: dbProfile.willing_to_relocate || false,
    resume_url: dbProfile.resume_url || undefined,
    resume_text: dbProfile.resume_text || undefined,
    skills: dbProfile.skills || [],
    years_of_experience: dbProfile.years_of_experience || undefined,
    current_title: dbProfile.current_title || undefined,
    current_company: dbProfile.current_company || undefined,
    career_goals: dbProfile.career_goals || undefined,
    elevator_pitch: dbProfile.elevator_pitch || undefined,
  };
}

/**
 * Transform database note to application Note type
 */
function transformDbNoteToNote(dbNote: DbNote): Note {
  return {
    id: dbNote.id,
    created_at: dbNote.created_at || new Date().toISOString(),
    job_id: dbNote.job_id || undefined,
    user_id: dbNote.user_id || '',
    content: dbNote.content,
    type: (dbNote.type as Note['type']) || 'general',
  };
}

// ============================================================================
// Jobs Service
// ============================================================================

/**
 * Fetch all jobs for the current user
 */
export async function fetchJobs(
  options: FetchJobsOptions = {}
): Promise<ServiceResult<Job[]>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const {
    status,
    priority,
    limit = 100,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'desc',
    search,
  } = options;

  let query = supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  if (priority) {
    query = query.eq('priority', priority);
  }

  if (search) {
    const sanitizedSearch = sanitizeSearchInput(search);
    if (sanitizedSearch) {
      query = query.or(`company.ilike.%${sanitizedSearch}%,title.ilike.%${sanitizedSearch}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return {
    data: (data || []).map(transformDbJobToJob),
    error: null,
  };
}

/**
 * Fetch a single job by ID
 */
export async function fetchJobById(jobId: string): Promise<ServiceResult<Job>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', userId)
    .single();

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return {
    data: transformDbJobToJob(data),
    error: null,
  };
}

/**
 * Create a new job
 */
export async function createJob(
  job: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<ServiceResult<Job>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const jobInsert: DbJobInsert = {
    user_id: userId,
    company: job.company,
    title: job.title,
    company_url: job.company_url,
    company_logo: job.company_logo,
    description: job.description,
    job_url: job.job_url,
    job_type: job.job_type,
    location: job.location,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    salary_currency: job.salary_currency,
    status: job.status,
    priority: job.priority,
    applied_date: job.applied_date,
    recruiter_name: job.recruiter_name,
    recruiter_email: job.recruiter_email,
    recruiter_phone: job.recruiter_phone,
    hiring_manager: job.hiring_manager,
    notes: job.notes,
    interview_notes: job.interview_notes,
    next_action: job.next_action,
    next_action_date: job.next_action_date,
    source: job.source,
    referral_name: job.referral_name,
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert(jobInsert)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  // Log the activity
  await logActivity({
    action: 'job_created',
    description: `Added job: ${job.title} at ${job.company}`,
    jobId: data.id,
    metadata: { status: job.status },
  });

  return {
    data: transformDbJobToJob(data),
    error: null,
  };
}

/**
 * Update an existing job
 */
export async function updateJob(
  jobId: string,
  updates: Partial<Omit<Job, 'id' | 'created_at' | 'user_id'>>
): Promise<ServiceResult<Job>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  // Fetch current job to track status changes
  const { data: currentJob } = await supabase
    .from('jobs')
    .select('status, title, company')
    .eq('id', jobId)
    .eq('user_id', userId)
    .single();

  const jobUpdate: DbJobUpdate = {};

  // Only include fields that are being updated
  if (updates.company !== undefined) jobUpdate.company = updates.company;
  if (updates.title !== undefined) jobUpdate.title = updates.title;
  if (updates.company_url !== undefined) jobUpdate.company_url = updates.company_url;
  if (updates.company_logo !== undefined) jobUpdate.company_logo = updates.company_logo;
  if (updates.description !== undefined) jobUpdate.description = updates.description;
  if (updates.job_url !== undefined) jobUpdate.job_url = updates.job_url;
  if (updates.job_type !== undefined) jobUpdate.job_type = updates.job_type;
  if (updates.location !== undefined) jobUpdate.location = updates.location;
  if (updates.salary_min !== undefined) jobUpdate.salary_min = updates.salary_min;
  if (updates.salary_max !== undefined) jobUpdate.salary_max = updates.salary_max;
  if (updates.salary_currency !== undefined) jobUpdate.salary_currency = updates.salary_currency;
  if (updates.status !== undefined) jobUpdate.status = updates.status;
  if (updates.priority !== undefined) jobUpdate.priority = updates.priority;
  if (updates.applied_date !== undefined) jobUpdate.applied_date = updates.applied_date;
  if (updates.recruiter_name !== undefined) jobUpdate.recruiter_name = updates.recruiter_name;
  if (updates.recruiter_email !== undefined) jobUpdate.recruiter_email = updates.recruiter_email;
  if (updates.recruiter_phone !== undefined) jobUpdate.recruiter_phone = updates.recruiter_phone;
  if (updates.hiring_manager !== undefined) jobUpdate.hiring_manager = updates.hiring_manager;
  if (updates.notes !== undefined) jobUpdate.notes = updates.notes;
  if (updates.interview_notes !== undefined) jobUpdate.interview_notes = updates.interview_notes;
  if (updates.next_action !== undefined) jobUpdate.next_action = updates.next_action;
  if (updates.next_action_date !== undefined) jobUpdate.next_action_date = updates.next_action_date;
  if (updates.source !== undefined) jobUpdate.source = updates.source;
  if (updates.referral_name !== undefined) jobUpdate.referral_name = updates.referral_name;

  const { data, error } = await supabase
    .from('jobs')
    .update(jobUpdate)
    .eq('id', jobId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  // Log status change activity if status was updated
  if (currentJob && updates.status && currentJob.status !== updates.status) {
    await logActivity({
      action: 'status_changed',
      description: `Status changed from ${currentJob.status} to ${updates.status} for ${currentJob.title} at ${currentJob.company}`,
      jobId,
      metadata: {
        previousStatus: currentJob.status,
        newStatus: updates.status,
      },
    });
  }

  return {
    data: transformDbJobToJob(data),
    error: null,
  };
}

/**
 * Delete a job
 */
export async function deleteJob(jobId: string): Promise<ServiceResult<boolean>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  // Fetch job info before deletion for activity log
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company')
    .eq('id', jobId)
    .eq('user_id', userId)
    .single();

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('user_id', userId);

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  // Log the deletion
  if (job) {
    await logActivity({
      action: 'job_deleted',
      description: `Deleted job: ${job.title} at ${job.company}`,
      metadata: { deletedJobId: jobId },
    });
  }

  return { data: true, error: null };
}

/**
 * Get job statistics for the current user
 */
export async function fetchJobStats(): Promise<
  ServiceResult<{
    total: number;
    saved: number;
    applied: number;
    interviewing: number;
    offers: number;
    rejected: number;
    response_rate: number;
  }>
> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('status')
    .eq('user_id', userId);

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  const jobs = data || [];
  const total = jobs.length;
  const saved = jobs.filter((j) => j.status === 'saved').length;
  const applied = jobs.filter((j) => j.status === 'applied').length;
  const interviewing = jobs.filter((j) =>
    ['screening', 'interview', 'technical', 'final'].includes(j.status || '')
  ).length;
  const offers = jobs.filter((j) => ['offer', 'accepted'].includes(j.status || '')).length;
  const rejected = jobs.filter((j) => j.status === 'rejected').length;

  // Response rate: (interviewing + offers + rejected) / (applied + interviewing + offers + rejected)
  const responded = interviewing + offers + rejected;
  const totalApplied = applied + interviewing + offers + rejected;
  const response_rate = totalApplied > 0 ? (responded / totalApplied) * 100 : 0;

  return {
    data: {
      total,
      saved,
      applied,
      interviewing,
      offers,
      rejected,
      response_rate: Math.round(response_rate * 10) / 10,
    },
    error: null,
  };
}

// ============================================================================
// Profile Service
// ============================================================================

/**
 * Fetch the current user's profile
 */
export async function fetchProfile(): Promise<ServiceResult<UserProfile>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // If no profile exists, return null without error
    if (error.code === 'PGRST116') {
      return { data: null, error: null };
    }
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return {
    data: transformDbProfileToProfile(data),
    error: null,
  };
}

/**
 * Create or update the current user's profile
 */
export async function upsertProfile(
  profile: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<ServiceResult<UserProfile>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const profileData: DbProfileInsert = {
    user_id: userId,
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin_url: profile.linkedin_url,
    github_url: profile.github_url,
    portfolio_url: profile.portfolio_url,
    target_roles: profile.target_roles,
    target_salary_min: profile.target_salary_min,
    target_salary_max: profile.target_salary_max,
    preferred_job_type: profile.preferred_job_type,
    willing_to_relocate: profile.willing_to_relocate,
    resume_url: profile.resume_url,
    resume_text: profile.resume_text,
    skills: profile.skills,
    years_of_experience: profile.years_of_experience,
    current_title: profile.current_title,
    current_company: profile.current_company,
    career_goals: profile.career_goals,
    elevator_pitch: profile.elevator_pitch,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return {
    data: transformDbProfileToProfile(data),
    error: null,
  };
}

// ============================================================================
// Notes Service
// ============================================================================

/**
 * Fetch notes for the current user
 */
export async function fetchNotes(
  options: FetchNotesOptions = {}
): Promise<ServiceResult<Note[]>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { jobId, type, limit = 100, offset = 0 } = options;

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (jobId) {
    query = query.eq('job_id', jobId);
  }

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return {
    data: (data || []).map(transformDbNoteToNote),
    error: null,
  };
}

/**
 * Create a new note
 */
export async function createNote(
  note: Omit<Note, 'id' | 'created_at' | 'user_id'>
): Promise<ServiceResult<Note>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const noteInsert: DbNoteInsert = {
    user_id: userId,
    job_id: note.job_id,
    content: note.content,
    type: note.type,
  };

  const { data, error } = await supabase
    .from('notes')
    .insert(noteInsert)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  // Log activity for notes attached to jobs
  if (note.job_id) {
    await logActivity({
      action: 'note_added',
      description: `Added ${note.type} note`,
      jobId: note.job_id,
      metadata: { noteType: note.type },
    });
  }

  return {
    data: transformDbNoteToNote(data),
    error: null,
  };
}

/**
 * Update an existing note
 */
export async function updateNote(
  noteId: string,
  updates: Partial<Pick<Note, 'content' | 'type'>>
): Promise<ServiceResult<Note>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return {
    data: transformDbNoteToNote(data),
    error: null,
  };
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<ServiceResult<boolean>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', userId);

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return { data: true, error: null };
}

// ============================================================================
// Activities Service
// ============================================================================

export interface LogActivityParams {
  action: string;
  description?: string;
  jobId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an activity for the current user
 */
export async function logActivity(
  params: LogActivityParams
): Promise<ServiceResult<DbActivity>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { action, description, jobId, metadata } = params;

  const activityInsert: DbActivityInsert = {
    user_id: userId,
    action,
    description,
    job_id: jobId,
    metadata: metadata as Json,
  };

  const { data, error } = await supabase
    .from('activities')
    .insert(activityInsert)
    .select()
    .single();

  if (error) {
    // Don't throw on activity logging failures - just log and return error
    console.error('Failed to log activity:', error);
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return { data, error: null };
}

/**
 * Fetch activities for the current user
 */
export async function fetchActivities(
  options: FetchActivitiesOptions = {}
): Promise<ServiceResult<DbActivity[]>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { jobId, action, limit = 50, offset = 0, startDate, endDate } = options;

  let query = supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (jobId) {
    query = query.eq('job_id', jobId);
  }

  if (action) {
    query = query.eq('action', action);
  }

  if (startDate) {
    query = query.gte('created_at', startDate);
  }

  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  const { data, error } = await query;

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  return { data: data || [], error: null };
}

/**
 * Get activity counts grouped by day for the specified period
 */
export async function fetchActivityCounts(
  days: number = 30
): Promise<ServiceResult<Record<string, number>>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('activities')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString());

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  // Group by date
  const counts: Record<string, number> = {};
  (data || []).forEach((activity) => {
    if (activity.created_at) {
      const date = activity.created_at.split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    }
  });

  return { data: counts, error: null };
}

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Batch update multiple jobs
 */
export async function batchUpdateJobs(
  updates: Array<{ id: string; updates: Partial<Omit<Job, 'id' | 'created_at' | 'user_id'>> }>
): Promise<ServiceResult<Job[]>> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const results: Job[] = [];
  const errors: string[] = [];

  for (const { id, updates: jobUpdates } of updates) {
    const result = await updateJob(id, jobUpdates);
    if (result.data) {
      results.push(result.data);
    } else if (result.error) {
      errors.push(`Job ${id}: ${result.error.message}`);
    }
  }

  if (errors.length > 0) {
    return {
      data: results,
      error: createError(`Some updates failed: ${errors.join('; ')}`, 'PARTIAL_ERROR'),
    };
  }

  return { data: results, error: null };
}

/**
 * Batch delete multiple jobs
 */
export async function batchDeleteJobs(jobIds: string[]): Promise<ServiceResult<boolean>> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: createError('User not authenticated', 'AUTH_ERROR') };
  }

  const { error } = await supabase
    .from('jobs')
    .delete()
    .in('id', jobIds)
    .eq('user_id', userId);

  if (error) {
    return {
      data: null,
      error: createError(error.message, error.code, error.details),
    };
  }

  // Log the batch deletion
  await logActivity({
    action: 'jobs_batch_deleted',
    description: `Deleted ${jobIds.length} jobs`,
    metadata: { deletedJobIds: jobIds },
  });

  return { data: true, error: null };
}

// ============================================================================
// Real-time Subscriptions
// ============================================================================

/**
 * Subscribe to job changes for the current user
 */
export function subscribeToJobs(
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: DbJob | null;
    old: DbJob | null;
  }) => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel('jobs-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'jobs',
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as DbJob | null,
          old: payload.old as DbJob | null,
        });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to activity changes for the current user
 */
export function subscribeToActivities(
  callback: (payload: {
    eventType: 'INSERT';
    new: DbActivity;
  }) => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel('activities-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activities',
      },
      (payload) => {
        callback({
          eventType: 'INSERT',
          new: payload.new as DbActivity,
        });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
