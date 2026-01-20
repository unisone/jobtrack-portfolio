'use client';

// Force dynamic rendering to bypass SSG prerender issues with Zustand store
// See: https://github.com/vercel/next.js/issues/85668
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useJobStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, User, Briefcase, Link as LinkIcon, Target } from 'lucide-react';
import type { UserProfile, JobType } from '@/types';
import { toast } from 'sonner';

export default function ProfilePage() {
  const profile = useJobStore((state) => state.profile);
  const setProfile = useJobStore((state) => state.setProfile);

  const [formData, setFormData] = useState<Partial<UserProfile>>(() =>
    profile ?? {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin_url: '',
      github_url: '',
      portfolio_url: '',
      target_roles: [],
      target_salary_min: undefined,
      target_salary_max: undefined,
      preferred_job_type: ['remote'],
      willing_to_relocate: false,
      skills: [],
      years_of_experience: undefined,
      current_title: '',
      current_company: '',
      career_goals: '',
      elevator_pitch: '',
      resume_text: '',
    }
  );

  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      id: profile?.id || crypto.randomUUID(),
      created_at: profile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      full_name: formData.full_name || '',
      email: formData.email || '',
      phone: formData.phone,
      location: formData.location,
      linkedin_url: formData.linkedin_url,
      github_url: formData.github_url,
      portfolio_url: formData.portfolio_url,
      target_roles: formData.target_roles || [],
      target_salary_min: formData.target_salary_min,
      target_salary_max: formData.target_salary_max,
      preferred_job_type: formData.preferred_job_type || ['remote'],
      willing_to_relocate: formData.willing_to_relocate || false,
      skills: formData.skills || [],
      years_of_experience: formData.years_of_experience,
      current_title: formData.current_title,
      current_company: formData.current_company,
      career_goals: formData.career_goals,
      elevator_pitch: formData.elevator_pitch,
      resume_text: formData.resume_text,
    };

    setProfile(updatedProfile);
    toast.success('Profile saved successfully!');
  };

  const addSkill = () => {
    if (newSkill && !formData.skills?.includes(newSkill)) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((s) => s !== skill) || [],
    });
  };

  const addRole = () => {
    if (newRole && !formData.target_roles?.includes(newRole)) {
      setFormData({
        ...formData,
        target_roles: [...(formData.target_roles || []), newRole],
      });
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setFormData({
      ...formData,
      target_roles: formData.target_roles?.filter((r) => r !== role) || [],
    });
  };

  const toggleJobType = (type: JobType) => {
    const current = formData.preferred_job_type || [];
    if (current.includes(type)) {
      setFormData({
        ...formData,
        preferred_job_type: current.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        preferred_job_type: [...current, type],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and job search preferences. This info helps Claude assist you better.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Venice, CA"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                placeholder="https://github.com/..."
                value={formData.github_url || ''}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                placeholder="https://..."
                value={formData.portfolio_url || ''}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Situation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Current Situation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_title">Current Title</Label>
                <Input
                  id="current_title"
                  placeholder="e.g., Software Engineer"
                  value={formData.current_title || ''}
                  onChange={(e) => setFormData({ ...formData, current_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_company">Current Company</Label>
                <Input
                  id="current_company"
                  placeholder="e.g., Acme Inc."
                  value={formData.current_company || ''}
                  onChange={(e) => setFormData({ ...formData, current_company: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g., 5"
                value={formData.years_of_experience || ''}
                onChange={(e) =>
                  setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills?.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-6 text-xs font-medium"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove skill: ${skill}`}
                  >
                    {skill} ×
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Job Search Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Roles</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a target role..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                />
                <Button type="button" onClick={addRole} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.target_roles?.map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-6 text-xs font-medium"
                    onClick={() => removeRole(role)}
                    aria-label={`Remove target role: ${role}`}
                  >
                    {role} ×
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Min Salary (k USD)</Label>
                <Input
                  id="salary_min"
                  type="number"
                  placeholder="e.g., 110"
                  value={formData.target_salary_min ? formData.target_salary_min / 1000 : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_salary_min: e.target.value ? parseInt(e.target.value) * 1000 : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Max Salary (k USD)</Label>
                <Input
                  id="salary_max"
                  type="number"
                  placeholder="e.g., 150"
                  value={formData.target_salary_max ? formData.target_salary_max / 1000 : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_salary_max: e.target.value ? parseInt(e.target.value) * 1000 : undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Work Type</Label>
              <div className="flex gap-2">
                {(['remote', 'hybrid', 'onsite'] as JobType[]).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.preferred_job_type?.includes(type) ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs font-medium capitalize"
                    onClick={() => toggleJobType(type)}
                    aria-pressed={formData.preferred_job_type?.includes(type)}
                    aria-label={`${formData.preferred_job_type?.includes(type) ? 'Deselect' : 'Select'} ${type} work type`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Context Section */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 Claude Context</CardTitle>
          <CardDescription>
            This information is used to help Claude Code provide better assistance with your job search.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="elevator">Elevator Pitch</Label>
            <Textarea
              id="elevator"
              placeholder="A brief 30-second pitch about yourself..."
              value={formData.elevator_pitch || ''}
              onChange={(e) => setFormData({ ...formData, elevator_pitch: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goals">Career Goals</Label>
            <Textarea
              id="goals"
              placeholder="What are you looking for in your next role? What matters most to you?"
              value={formData.career_goals || ''}
              onChange={(e) => setFormData({ ...formData, career_goals: e.target.value })}
              rows={3}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="resume">Resume Text</Label>
            <p className="text-xs text-muted-foreground">
              Paste your resume text here so Claude can reference it when helping you.
            </p>
            <Textarea
              id="resume"
              placeholder="Paste your full resume text here..."
              value={formData.resume_text || ''}
              onChange={(e) => setFormData({ ...formData, resume_text: e.target.value })}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
