'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSync } from '@/components/providers/sync-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  Check,
  LogIn,
  Loader2,
  Sparkles,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import type { JobType, Priority } from '@/types';

/**
 * Public Import Page
 *
 * Receives job data from browser extension via URL parameters.
 * - If user is logged in: saves job and redirects to /jobs
 * - If not logged in: shows job preview with sign-in prompt
 *
 * This page is NOT protected by auth middleware to preserve URL params.
 */
export default function ImportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createJob } = useSync();

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasAttemptedAutoSave = useRef(false);

  // Extract job data from URL params
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    job_url: '',
    source: '',
    notes: '',
    job_type: 'remote' as JobType,
    priority: 'medium' as Priority,
  });

  // Parse URL params on mount, or restore from sessionStorage after login
  useEffect(() => {
    const source = searchParams.get('source');
    if (source === 'extension') {
      // Fresh import from extension
      setJobData({
        title: searchParams.get('title') || '',
        company: searchParams.get('company') || '',
        location: searchParams.get('location') || '',
        job_url: searchParams.get('job_url') || '',
        source: searchParams.get('job_source') || '',
        notes: searchParams.get('notes') || '',
        job_type: 'remote' as JobType,
        priority: 'medium' as Priority,
      });
    } else {
      // Check if returning from login with stored job data
      const storedJob = sessionStorage.getItem('pendingJobImport');
      if (storedJob) {
        try {
          const parsed = JSON.parse(storedJob);
          setJobData(parsed);
          sessionStorage.removeItem('pendingJobImport'); // Clean up
        } catch (e) {
          console.error('Failed to parse stored job data:', e);
        }
      }
    }
  }, [searchParams]);

  const handleSave = useCallback(async () => {
    if (!jobData.company || !jobData.title) {
      toast.error('Company and job title are required');
      return;
    }

    setIsSaving(true);
    try {
      // Only include required fields and fields we have data for
      await createJob({
        // Required fields
        company: jobData.company,
        title: jobData.title,
        job_type: jobData.job_type,
        status: 'saved',
        priority: jobData.priority,
        salary_currency: 'USD',
        // Optional fields with data
        ...(jobData.location && { location: jobData.location }),
        ...(jobData.job_url && { job_url: jobData.job_url }),
        ...(jobData.source && { source: jobData.source }),
        ...(jobData.notes && { notes: jobData.notes }),
      });

      setSaved(true);
      toast.success('Job saved to tracker!');

      // Redirect to jobs page after short delay
      setTimeout(() => {
        router.push('/jobs');
      }, 1500);
    } catch (error) {
      console.error('Failed to save job:', error);
      toast.error('Failed to save job. Please try again.');
      hasAttemptedAutoSave.current = false; // Allow retry
    } finally {
      setIsSaving(false);
    }
  }, [jobData, createJob, router]);

  // Auto-save when user is authenticated and we have job data
  useEffect(() => {
    if (
      !authLoading &&
      user &&
      jobData.title &&
      jobData.company &&
      !saved &&
      !hasAttemptedAutoSave.current
    ) {
      hasAttemptedAutoSave.current = true;
      handleSave();
    }
  }, [authLoading, user, jobData.title, jobData.company, saved, handleSave]);

  const handleSignIn = () => {
    // Store job data in sessionStorage so we can retrieve it after login
    sessionStorage.setItem('pendingJobImport', JSON.stringify(jobData));
    router.push('/auth/login?redirect=/import/restore');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  // No job data from extension
  if (!searchParams.get('source')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>No Job Data Found</CardTitle>
            <CardDescription>
              This page is used to import jobs from the browser extension.
              Visit a job listing page and click the extension button to import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/jobs')} variant="outline">
              Go to Job Tracker
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Successfully saved
  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-emerald-600 dark:text-emerald-400">Job Saved!</CardTitle>
            <CardDescription>
              <span className="font-medium text-foreground">{jobData.title}</span>
              <br />
              at {jobData.company}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to your job tracker...
            </p>
            <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            From Browser Extension
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Import Job</h1>
          <p className="text-muted-foreground">
            Review the job details below and save to your tracker
          </p>
        </div>

        {/* Job Preview Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate">{jobData.title || 'Untitled Position'}</CardTitle>
                <CardDescription className="text-base font-medium text-foreground/80">
                  {jobData.company || 'Unknown Company'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Editable Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={jobData.company}
                  onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                  placeholder="e.g. Anthropic"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    value={jobData.location}
                    onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type">Work Type</Label>
                <Select
                  value={jobData.job_type}
                  onValueChange={(value) => setJobData({ ...jobData, job_type: value as JobType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job URL */}
            {jobData.job_url && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <a
                  href={jobData.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-primary hover:underline flex-1"
                >
                  {jobData.job_url}
                </a>
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={jobData.notes}
                onChange={(e) => setJobData({ ...jobData, notes: e.target.value })}
                placeholder="Add any notes about this position..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            {user ? (
              // Logged in - show save button
              <div className="space-y-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !jobData.title || !jobData.company}
                  className="w-full"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save to Tracker
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Signed in as {user.email}
                </p>
              </div>
            ) : (
              // Not logged in - show sign in prompt
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Sign in to save this job to your tracker
                  </p>
                </div>
                <Button
                  onClick={handleSignIn}
                  className="w-full"
                  size="lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In to Save
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Your job data will be preserved after signing in
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
