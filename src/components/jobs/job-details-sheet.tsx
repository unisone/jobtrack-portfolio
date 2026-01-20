'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  Briefcase,
  FileText,
  MessageSquare,
  Clock,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { useSync } from '@/components/providers/sync-provider';
import type { Job, JobStatus, Note } from '@/types';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/ui/status-badge';
import { getStatusOptions } from '@/lib/status';

interface JobDetailsSheetProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDetailsSheet({ job, open, onOpenChange }: JobDetailsSheetProps) {
  const { updateJob } = useSync();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedJob, setEditedJob] = useState<Partial<Job>>({});
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  if (!job) return null;

  const handleEdit = () => {
    setEditedJob(job);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateJob(job.id, editedJob);
      setIsEditing(false);
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedJob({});
    setIsEditing(false);
  };

  const handleStatusChange = async (status: JobStatus) => {
    try {
      await updateJob(job.id, { status });
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      job_id: job.id,
      user_id: 'local-user',
      content: newNote,
      type: 'general',
    };

    setNotes([note, ...notes]);
    try {
      await updateJob(job.id, {
        notes: job.notes ? `${job.notes}\n\n---\n\n${newNote}` : newNote
      });
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{job.title}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4" />
                {job.company}
              </SheetDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              {/* Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={job.status} onValueChange={(v) => handleStatusChange(v as JobStatus)}>
                    <SelectTrigger>
                      <SelectValue>
                        <StatusBadge status={job.status} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusOptions().map(({ value }) => (
                        <SelectItem key={value} value={value}>
                          <StatusBadge status={value} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Job Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline">{job.job_type}</Badge>
                    {job.priority && (
                      <Badge variant={job.priority === 'high' ? 'destructive' : 'secondary'}>
                        {job.priority} priority
                      </Badge>
                    )}
                  </div>

                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                  )}

                  {(job.salary_min || job.salary_max) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {job.salary_min && job.salary_max
                        ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                        : job.salary_min
                        ? `From $${(job.salary_min / 1000).toFixed(0)}k`
                        : `Up to $${(job.salary_max! / 1000).toFixed(0)}k`}
                      {job.salary_currency && ` ${job.salary_currency}`}
                    </div>
                  )}

                  {job.applied_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Applied {format(new Date(job.applied_date), 'MMMM d, yyyy')}
                    </div>
                  )}

                  {job.source && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LinkIcon className="h-4 w-4" />
                      Source: {job.source}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Links */}
              {(job.job_url || job.company_url) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {job.job_url && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-2" />
                          View Job Posting
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      </Button>
                    )}
                    {job.company_url && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={job.company_url} target="_blank" rel="noopener noreferrer">
                          <Building2 className="h-4 w-4 mr-2" />
                          Company Website
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Next Action */}
              {job.next_action && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-700">
                      <Clock className="h-4 w-4" />
                      Next Action
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-orange-800">{job.next_action}</p>
                    {job.next_action_date && (
                      <p className="text-xs text-orange-600 mt-1">
                        Due: {format(new Date(job.next_action_date), 'MMMM d, yyyy')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              {job.description && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              {/* Add Note */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Add Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Add a note about this job..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.trim()} size="sm">
                    Add Note
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Notes */}
              {job.notes && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {job.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Interview Notes */}
              {job.interview_notes && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Interview Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {job.interview_notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {!job.notes && !job.interview_notes && notes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notes yet. Add your first note above!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4 mt-4">
              {(job.recruiter_name || job.recruiter_email || job.recruiter_phone || job.hiring_manager) ? (
                <>
                  {(job.recruiter_name || job.recruiter_email || job.recruiter_phone) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Recruiter
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {job.recruiter_name && (
                          <p className="text-sm font-medium">{job.recruiter_name}</p>
                        )}
                        {job.recruiter_email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${job.recruiter_email}`} className="hover:underline">
                              {job.recruiter_email}
                            </a>
                          </div>
                        )}
                        {job.recruiter_phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${job.recruiter_phone}`} className="hover:underline">
                              {job.recruiter_phone}
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {job.hiring_manager && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Hiring Manager
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{job.hiring_manager}</p>
                      </CardContent>
                    </Card>
                  )}

                  {job.referral_name && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Referral</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{job.referral_name}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No contact information added yet.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={handleEdit}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Add Contacts
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
