'use client';

import { useState, useEffect } from 'react';
import { useSync } from '@/components/providers/sync-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { JobType, JobStatus, Priority } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface InitialJobData {
  company?: string;
  title?: string;
  location?: string;
  job_url?: string;
  source?: string;
  notes?: string;
}

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: InitialJobData;
}

const defaultFormData = {
  company: '',
  company_url: '',
  title: '',
  job_url: '',
  job_type: 'remote' as JobType,
  location: '',
  salary_min: '',
  salary_max: '',
  status: 'saved' as JobStatus,
  priority: 'medium' as Priority,
  source: '',
  notes: '',
  recruiter_name: '',
  recruiter_email: '',
};

export function AddJobDialog({ open, onOpenChange, initialData }: AddJobDialogProps) {
  const { createJob } = useSync();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [formData, setFormData] = useState(defaultFormData);

  // Pre-fill form when initialData changes and dialog opens
  useEffect(() => {
    if (open && initialData && !hasInitialized) {
      setFormData({
        ...defaultFormData,
        company: initialData.company || '',
        title: initialData.title || '',
        location: initialData.location || '',
        job_url: initialData.job_url || '',
        source: initialData.source || '',
        notes: initialData.notes || '',
      });
      setHasInitialized(true);
    }
    // Reset when dialog closes
    if (!open) {
      setHasInitialized(false);
    }
  }, [open, initialData, hasInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.title) {
      toast.error('Please fill in company and job title');
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        company: formData.company,
        company_url: formData.company_url || undefined,
        title: formData.title,
        job_url: formData.job_url || undefined,
        job_type: formData.job_type,
        location: formData.location || undefined,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) * 1000 : undefined,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) * 1000 : undefined,
        salary_currency: 'USD',
        status: formData.status,
        priority: formData.priority,
        source: formData.source || undefined,
        notes: formData.notes || undefined,
        recruiter_name: formData.recruiter_name || undefined,
        recruiter_email: formData.recruiter_email || undefined,
        applied_date: formData.status !== 'saved' ? new Date().toISOString() : undefined,
      };

      const result = await createJob(jobData);

      if (result) {
        toast.success(`Added ${formData.title} at ${formData.company}`);

        // Reset form
        setFormData({
          company: '',
          company_url: '',
          title: '',
          job_url: '',
          job_type: 'remote',
          location: '',
          salary_min: '',
          salary_max: '',
          status: 'saved',
          priority: 'medium',
          source: '',
          notes: '',
          recruiter_name: '',
          recruiter_email: '',
        });

        onOpenChange(false);
      } else {
        toast.error('Failed to add job. Please try again.');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to add job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Track a new job opportunity. Fill in as much detail as you have.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_url">Company Website</Label>
                  <Input
                    id="company_url"
                    placeholder="https://google.com"
                    value={formData.company_url}
                    onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_url">Job Posting URL</Label>
                  <Input
                    id="job_url"
                    placeholder="https://..."
                    value={formData.job_url}
                    onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_type">Work Type</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, job_type: value as JobType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as JobStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value as Priority })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary_min">Salary Min (k USD)</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    placeholder="e.g., 110"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_max">Salary Max (k USD)</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., LinkedIn, Indeed, Referral"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this job opportunity..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recruiter_name">Recruiter Name</Label>
                <Input
                  id="recruiter_name"
                  placeholder="e.g., Jane Smith"
                  value={formData.recruiter_name}
                  onChange={(e) => setFormData({ ...formData, recruiter_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recruiter_email">Recruiter Email</Label>
                <Input
                  id="recruiter_email"
                  type="email"
                  placeholder="e.g., jane@company.com"
                  value={formData.recruiter_email}
                  onChange={(e) => setFormData({ ...formData, recruiter_email: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Job'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
