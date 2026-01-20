'use client';

/**
 * Supabase Sync Hook
 *
 * Synchronizes the local Zustand store with Supabase database.
 * Provides offline-first experience with automatic sync when online.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useJobStore } from '@/lib/store';
import {
  fetchJobs,
  fetchProfile,
  createJob as createJobService,
  updateJob as updateJobService,
  deleteJob as deleteJobService,
  upsertProfile,
  subscribeToJobs,
} from '@/lib/supabase/services';
import { createClient } from '@/lib/supabase/client';
import type { Job, UserProfile } from '@/types';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface SyncStatus {
  isLoading: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
  user: User | null;
}

export interface UseSupabaseSyncReturn {
  status: SyncStatus;
  syncNow: () => Promise<void>;
  createJob: (job: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Job | null>;
  updateJob: (jobId: string, updates: Partial<Job>) => Promise<Job | null>;
  deleteJob: (jobId: string) => Promise<boolean>;
  saveProfile: (profile: Partial<UserProfile>) => Promise<UserProfile | null>;
}

/**
 * Hook for syncing local state with Supabase
 *
 * Features:
 * - Loads data from Supabase on mount when authenticated
 * - Real-time subscriptions for live updates
 * - Offline-first: local changes are saved to Zustand immediately
 * - Background sync to Supabase when online
 */
export function useSupabaseSync(): UseSupabaseSyncReturn {
  const [status, setStatus] = useState<SyncStatus>({
    isLoading: true,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSyncedAt: null,
    error: null,
    user: null,
  });

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const hasFetchedRef = useRef(false);

  // Get store actions
  const setJobs = useJobStore((state) => state.setJobs);
  const setProfile = useJobStore((state) => state.setProfile);
  const storeAddJob = useJobStore((state) => state.addJob);
  const storeUpdateJob = useJobStore((state) => state.updateJob);
  const storeDeleteJob = useJobStore((state) => state.deleteJob);

  /**
   * Fetch all data from Supabase and update local store
   */
  const fetchData = useCallback(async () => {
    setStatus((prev) => ({ ...prev, isSyncing: true, error: null }));

    try {
      // Fetch jobs and profile in parallel
      const [jobsResult, profileResult] = await Promise.all([
        fetchJobs({ limit: 500 }),
        fetchProfile(),
      ]);

      if (jobsResult.error) {
        throw new Error(jobsResult.error.message);
      }

      // Update local store with fetched data
      if (jobsResult.data) {
        setJobs(jobsResult.data);
      }

      if (profileResult.data) {
        setProfile(profileResult.data);
      }

      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: new Date(),
        error: null,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sync data';
      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        error: message,
      }));
      console.error('Supabase sync error:', error);
    }
  }, [setJobs, setProfile]);

  /**
   * Set up real-time subscriptions
   */
  const setupSubscriptions = useCallback(() => {
    // Clean up existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to job changes
    unsubscribeRef.current = subscribeToJobs((payload) => {
      const { eventType, new: newJob, old: oldJob } = payload;

      // Get current jobs from store
      const currentJobs = useJobStore.getState().jobs;

      switch (eventType) {
        case 'INSERT':
          if (newJob) {
            // Check if job already exists (we might have added it locally)
            const exists = currentJobs.some((j) => j.id === newJob.id);
            if (!exists) {
              // Transform and add to store
              const job: Job = {
                id: newJob.id,
                created_at: newJob.created_at || new Date().toISOString(),
                updated_at: newJob.updated_at || new Date().toISOString(),
                user_id: newJob.user_id || '',
                company: newJob.company,
                company_url: newJob.company_url || undefined,
                title: newJob.title,
                description: newJob.description || undefined,
                job_url: newJob.job_url || undefined,
                job_type: (newJob.job_type as Job['job_type']) || 'remote',
                location: newJob.location || undefined,
                salary_min: newJob.salary_min || undefined,
                salary_max: newJob.salary_max || undefined,
                salary_currency: newJob.salary_currency || 'USD',
                status: (newJob.status as Job['status']) || 'saved',
                priority: (newJob.priority as Job['priority']) || 'medium',
                applied_date: newJob.applied_date || undefined,
                notes: newJob.notes || undefined,
              };
              setJobs([...currentJobs, job]);
            }
          }
          break;

        case 'UPDATE':
          if (newJob) {
            setJobs(
              currentJobs.map((j) =>
                j.id === newJob.id
                  ? {
                      ...j,
                      // Selectively update fields, preserving existing required values
                      company: newJob.company ?? j.company,
                      title: newJob.title ?? j.title,
                      company_url: newJob.company_url || undefined,
                      company_logo: newJob.company_logo || undefined,
                      description: newJob.description || undefined,
                      job_url: newJob.job_url || undefined,
                      job_type: (newJob.job_type as Job['job_type']) || j.job_type,
                      location: newJob.location || undefined,
                      salary_min: newJob.salary_min || undefined,
                      salary_max: newJob.salary_max || undefined,
                      salary_currency: newJob.salary_currency || j.salary_currency,
                      status: (newJob.status as Job['status']) || j.status,
                      priority: (newJob.priority as Job['priority']) || j.priority,
                      applied_date: newJob.applied_date || undefined,
                      recruiter_name: newJob.recruiter_name || undefined,
                      recruiter_email: newJob.recruiter_email || undefined,
                      recruiter_phone: newJob.recruiter_phone || undefined,
                      hiring_manager: newJob.hiring_manager || undefined,
                      notes: newJob.notes || undefined,
                      interview_notes: newJob.interview_notes || undefined,
                      next_action: newJob.next_action || undefined,
                      next_action_date: newJob.next_action_date || undefined,
                      source: newJob.source || undefined,
                      referral_name: newJob.referral_name || undefined,
                      updated_at: newJob.updated_at || new Date().toISOString(),
                    }
                  : j
              )
            );
          }
          break;

        case 'DELETE':
          if (oldJob) {
            setJobs(currentJobs.filter((j) => j.id !== oldJob.id));
          }
          break;
      }
    });
  }, [setJobs]);

  /**
   * Initialize auth listener and fetch data
   */
  useEffect(() => {
    const supabase = createClient();

    // Check initial auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      setStatus((prev) => ({
        ...prev,
        user,
        isLoading: !user, // Keep loading if no user
      }));

      if (user && !hasFetchedRef.current) {
        hasFetchedRef.current = true;
        await fetchData();
        setupSubscriptions();
        setStatus((prev) => ({ ...prev, isLoading: false }));
      } else if (!user) {
        setStatus((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;

        setStatus((prev) => ({ ...prev, user }));

        if (event === 'SIGNED_IN' && user && !hasFetchedRef.current) {
          hasFetchedRef.current = true;
          await fetchData();
          setupSubscriptions();
        } else if (event === 'SIGNED_OUT') {
          hasFetchedRef.current = false;
          // Clear local store on sign out
          setJobs([]);
          setProfile(null);
          // Clean up subscription
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        }
      }
    );

    // Online/offline listener
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true }));
      // Sync when coming back online
      if (hasFetchedRef.current) {
        fetchData();
      }
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [fetchData, setupSubscriptions, setJobs, setProfile]);

  /**
   * Manual sync trigger
   */
  const syncNow = useCallback(async () => {
    if (!status.user) return;
    await fetchData();
  }, [status.user, fetchData]);

  /**
   * Create a new job (syncs to Supabase)
   */
  const createJob = useCallback(
    async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Job | null> => {
      // If not authenticated, create locally only
      if (!status.user) {
        const localJob: Job = {
          ...jobData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'local-user',
        };
        storeAddJob(localJob);
        return localJob;
      }

      // Create in Supabase
      const result = await createJobService(jobData);

      if (result.error) {
        console.error('Failed to create job:', result.error);
        // Fallback to local creation
        const localJob: Job = {
          ...jobData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: status.user.id,
        };
        storeAddJob(localJob);
        return localJob;
      }

      // Add to local store (real-time subscription will also catch this)
      if (result.data) {
        storeAddJob(result.data);
      }

      return result.data;
    },
    [status.user, storeAddJob]
  );

  /**
   * Update a job (syncs to Supabase)
   * With rollback on failure for data consistency
   */
  const updateJob = useCallback(
    async (jobId: string, updates: Partial<Job>): Promise<Job | null> => {
      // Store original job state for potential rollback
      const originalJob = useJobStore.getState().jobs.find((j) => j.id === jobId);

      // Update locally first (optimistic update)
      storeUpdateJob(jobId, updates);

      // If not authenticated, local update is sufficient
      if (!status.user) {
        return useJobStore.getState().jobs.find((j) => j.id === jobId) || null;
      }

      // Sync to Supabase
      const result = await updateJobService(jobId, updates);

      if (result.error) {
        console.error('Failed to update job in Supabase:', result.error);

        // Rollback: restore original job state
        if (originalJob) {
          storeUpdateJob(jobId, originalJob);
          toast.error('Failed to save changes. Changes have been reverted.');
        }
        return null;
      }

      return result.data || useJobStore.getState().jobs.find((j) => j.id === jobId) || null;
    },
    [status.user, storeUpdateJob]
  );

  /**
   * Delete a job (syncs to Supabase)
   * With rollback on failure to maintain data consistency
   */
  const deleteJob = useCallback(
    async (jobId: string): Promise<boolean> => {
      // Store the job before deletion for potential rollback
      const jobToDelete = useJobStore.getState().jobs.find((j) => j.id === jobId);

      // Delete locally first (optimistic delete)
      storeDeleteJob(jobId);

      // If not authenticated, local delete is sufficient
      if (!status.user) {
        return true;
      }

      // Sync to Supabase
      const result = await deleteJobService(jobId);

      if (result.error) {
        console.error('Failed to delete job in Supabase:', result.error);

        // Rollback: restore the deleted job to local store
        if (jobToDelete) {
          storeAddJob(jobToDelete);
          toast.error('Failed to delete job. The job has been restored.');
        }
        return false;
      }

      return true;
    },
    [status.user, storeDeleteJob, storeAddJob]
  );

  /**
   * Save profile (syncs to Supabase)
   */
  const saveProfile = useCallback(
    async (profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
      // Update locally first
      const currentProfile = useJobStore.getState().profile;
      const updatedProfile: UserProfile = {
        id: currentProfile?.id || crypto.randomUUID(),
        created_at: currentProfile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: profileData.full_name || currentProfile?.full_name || '',
        email: profileData.email || currentProfile?.email || '',
        phone: profileData.phone || currentProfile?.phone,
        location: profileData.location || currentProfile?.location,
        linkedin_url: profileData.linkedin_url || currentProfile?.linkedin_url,
        github_url: profileData.github_url || currentProfile?.github_url,
        portfolio_url: profileData.portfolio_url || currentProfile?.portfolio_url,
        target_roles: profileData.target_roles || currentProfile?.target_roles || [],
        target_salary_min: profileData.target_salary_min || currentProfile?.target_salary_min,
        target_salary_max: profileData.target_salary_max || currentProfile?.target_salary_max,
        preferred_job_type: profileData.preferred_job_type || currentProfile?.preferred_job_type || ['remote'],
        willing_to_relocate: profileData.willing_to_relocate ?? currentProfile?.willing_to_relocate ?? false,
        resume_url: profileData.resume_url || currentProfile?.resume_url,
        resume_text: profileData.resume_text || currentProfile?.resume_text,
        skills: profileData.skills || currentProfile?.skills || [],
        years_of_experience: profileData.years_of_experience || currentProfile?.years_of_experience,
        current_title: profileData.current_title || currentProfile?.current_title,
        current_company: profileData.current_company || currentProfile?.current_company,
        career_goals: profileData.career_goals || currentProfile?.career_goals,
        elevator_pitch: profileData.elevator_pitch || currentProfile?.elevator_pitch,
      };

      setProfile(updatedProfile);

      // If not authenticated, local update is sufficient
      if (!status.user) {
        return updatedProfile;
      }

      // Sync to Supabase
      const result = await upsertProfile(profileData);

      if (result.error) {
        console.error('Failed to save profile in Supabase:', result.error);
        // Local update already applied, keep it
      }

      return result.data || updatedProfile;
    },
    [status.user, setProfile]
  );

  return {
    status,
    syncNow,
    createJob,
    updateJob,
    deleteJob,
    saveProfile,
  };
}

// Note: Provider component moved to src/components/providers/sync-provider.tsx
// to separate JSX from the hook logic (JSX requires .tsx extension)
