'use client';

// Force dynamic rendering to bypass SSG prerender issues with Zustand store
// See: https://github.com/vercel/next.js/issues/85668
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useJobStore } from '@/lib/store';
import { useSync } from '@/components/providers/sync-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  StickyNote,
  Loader2,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddJobDialog } from '@/components/jobs/add-job-dialog';
import { JobDetailsSheet } from '@/components/jobs/job-details-sheet';
import type { Job, JobStatus } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getStatusOptions } from '@/lib/status';
import { StatusBadge } from '@/components/ui/status-badge';

interface InitialJobData {
  company?: string;
  title?: string;
  location?: string;
  job_url?: string;
  source?: string;
  notes?: string;
}

function JobsPageContent() {
  const jobs = useJobStore((state) => state.jobs);
  const { updateJob, deleteJob, status: syncStatus } = useSync();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [initialJobData, setInitialJobData] = useState<InitialJobData | undefined>();
  const hasProcessedExtensionParams = useRef(false);

  // Handle incoming data from browser extension
  useEffect(() => {
    if (hasProcessedExtensionParams.current) return;

    const source = searchParams.get('source');
    if (source === 'extension') {
      hasProcessedExtensionParams.current = true;

      const jobData: InitialJobData = {
        title: searchParams.get('title') || undefined,
        company: searchParams.get('company') || undefined,
        location: searchParams.get('location') || undefined,
        job_url: searchParams.get('job_url') || undefined,
        source: searchParams.get('job_source') || undefined,
        notes: searchParams.get('notes') || undefined,
      };

      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setInitialJobData(jobData);
        setIsAddDialogOpen(true);
        // Clear URL params to prevent re-triggering on refresh
        router.replace('/jobs');
      }, 0);
    }
  }, [searchParams, router]);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort by most recent first
  const sortedJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    await updateJob(jobId, { status: newStatus });
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleDelete = async (job: Job) => {
    await deleteJob(job.id);
    toast.success(`Deleted ${job.title} at ${job.company}`);
  };

  const handleRowClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  // Show loading state while syncing
  if (syncStatus.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">
            Job Applications
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              {jobs.length} total
            </span>
            <span className="text-border">•</span>
            <span>{filteredJobs.length} showing</span>
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 size-4" />
          Add Job
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by job title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50">
                <Filter className="mr-2 size-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="saved">Saved</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="final">Final Round</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="overflow-hidden border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Position</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Location</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">Salary</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="hidden sm:table-cell font-semibold">Applied</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64">
                    {jobs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <Briefcase className="size-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-1">No jobs tracked yet</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mb-6">
                          Start building your job search pipeline by adding your first application
                        </p>
                        <Button
                          onClick={() => setIsAddDialogOpen(true)}
                          className="shadow-lg shadow-primary/20"
                        >
                          <Sparkles className="mr-2 size-4" />
                          Add your first job
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="size-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                          <Search className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No jobs match your filters.</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setSearch('');
                            setStatusFilter('all');
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                sortedJobs.map((job, index) => {
                  return (
                    <TableRow
                      key={job.id}
                      className={cn(
                        'group cursor-pointer transition-colors duration-200',
                        'hover:bg-primary/5 dark:hover:bg-primary/10',
                        'page-enter',
                        index < 5 && `stagger-${index + 1}`
                      )}
                      onClick={() => handleRowClick(job)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-muted-foreground">
                              {job.company.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{job.company}</p>
                            {job.company_url && (
                              <a
                                href={job.company_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Website <ExternalLink className="size-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <Badge variant="outline" className="mt-1 text-xs font-normal">
                            {job.job_type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {job.location || '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {job.salary_min && job.salary_max ? (
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={job.status}
                          onValueChange={(value) => handleStatusChange(job.id, value as JobStatus)}
                        >
                          <SelectTrigger className="w-32 h-8 border-0 p-0 focus:ring-0 hover:bg-transparent">
                            <StatusBadge status={job.status} />
                          </SelectTrigger>
                          <SelectContent>
                            {getStatusOptions().map(({ value }) => (
                              <SelectItem key={value} value={value}>
                                <StatusBadge status={value} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {job.applied_date ? format(new Date(job.applied_date), 'MMM d, yyyy') : '—'}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity data-[state=open]:opacity-100"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewDetails(job)}>
                              <Eye className="mr-2 size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDetails(job)}>
                              <Edit2 className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDetails(job)}>
                              <StickyNote className="mr-2 size-4" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => handleDelete(job)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Job Dialog */}
      <AddJobDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          // Clear initial data when dialog closes
          if (!open) setInitialJobData(undefined);
        }}
        initialData={initialJobData}
      />

      {/* Job Details Sheet */}
      <JobDetailsSheet
        job={selectedJob}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}
