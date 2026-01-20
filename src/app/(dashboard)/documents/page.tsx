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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Upload,
  Link as LinkIcon,
  Award,
  Plus,
  Trash2,
  Star,
  ExternalLink,
  Edit2,
  Check,
} from 'lucide-react';
import type {
  Resume,
  CoverLetterTemplate,
  PortfolioLink,
  PortfolioLinkType,
  Certificate,
} from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Resume Section Component
function ResumeSection() {
  const resumes = useJobStore((state) => state.resumes);
  const addResume = useJobStore((state) => state.addResume);
  const deleteResume = useJobStore((state) => state.deleteResume);
  const setPrimaryResume = useJobStore((state) => state.setPrimaryResume);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [resumeText, setResumeText] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  const handleAddResume = () => {
    if (!selectedFile) {
      toast.error('Please select a resume file');
      return;
    }

    const newResume: Resume = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      filename: selectedFile,
      text: resumeText || undefined,
      is_primary: resumes.length === 0, // First resume is automatically primary
    };

    addResume(newResume);
    setIsDialogOpen(false);
    setSelectedFile('');
    setResumeText('');
    toast.success('Resume added successfully');
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    toast.success('Resume deleted');
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryResume(id);
    toast.success('Primary resume updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Resumes</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage your resume versions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Resume</DialogTitle>
              <DialogDescription>
                Upload a new resume file. You can also paste the text content for AI assistance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume-file">Resume File</Label>
                <Input
                  id="resume-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-text">Resume Text (Optional)</Label>
                <p className="text-xs text-muted-foreground">
                  Paste your resume text here so Claude can reference it when helping you.
                </p>
                <Textarea
                  id="resume-text"
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddResume}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No resumes uploaded yet.
              <br />
              Upload your first resume to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className={resume.is_primary ? 'border-primary' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{resume.filename}</CardTitle>
                      <CardDescription className="text-xs">
                        Added {format(new Date(resume.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                  </div>
                  {resume.is_primary && (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" />
                      Primary
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {resume.text && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {resume.text.substring(0, 150)}...
                  </p>
                )}
                <div className="flex gap-2">
                  {!resume.is_primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(resume.id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Set Primary
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(resume.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Cover Letter Templates Section Component
function CoverLetterSection() {
  const templates = useJobStore((state) => state.coverLetterTemplates);
  const addTemplate = useJobStore((state) => state.addCoverLetterTemplate);
  const updateTemplate = useJobStore((state) => state.updateCoverLetterTemplate);
  const deleteTemplate = useJobStore((state) => state.deleteCoverLetterTemplate);
  const setDefault = useJobStore((state) => state.setDefaultCoverLetter);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CoverLetterTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    target_role: '',
  });

  const resetForm = () => {
    setFormData({ name: '', content: '', target_role: '' });
    setEditingTemplate(null);
  };

  const handleOpenDialog = (template?: CoverLetterTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        content: template.content,
        target_role: template.target_role || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.content) {
      toast.error('Please fill in name and content');
      return;
    }

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, {
        name: formData.name,
        content: formData.content,
        target_role: formData.target_role || undefined,
      });
      toast.success('Template updated');
    } else {
      const newTemplate: CoverLetterTemplate = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: formData.name,
        content: formData.content,
        target_role: formData.target_role || undefined,
        is_default: templates.length === 0,
      };
      addTemplate(newTemplate);
      toast.success('Template created');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    toast.success('Template deleted');
  };

  const handleSetDefault = (id: string) => {
    setDefault(id);
    toast.success('Default template updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Cover Letter Templates</h2>
          <p className="text-sm text-muted-foreground">
            Save reusable cover letter templates for different roles
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create Cover Letter Template'}
              </DialogTitle>
              <DialogDescription>
                Create a reusable cover letter template. Use placeholders like [Company Name], [Role], etc.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g., General Software Engineer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-role">Target Role (Optional)</Label>
                  <Input
                    id="target-role"
                    placeholder="e.g., Frontend Developer"
                    value={formData.target_role}
                    onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-content">Cover Letter Content</Label>
                <Textarea
                  id="template-content"
                  placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in the [Role] position at [Company Name]..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingTemplate ? 'Save Changes' : 'Create Template'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No cover letter templates yet.
              <br />
              Create your first template to speed up applications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={template.is_default ? 'border-primary' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {template.target_role && (
                      <Badge variant="secondary" className="mt-1">
                        {template.target_role}
                      </Badge>
                    )}
                  </div>
                  {template.is_default && (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" />
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {template.content.substring(0, 200)}...
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(template)}
                  >
                    <Edit2 className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  {!template.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(template.id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Portfolio Links Section Component
function PortfolioSection() {
  const links = useJobStore((state) => state.portfolioLinks);
  const addLink = useJobStore((state) => state.addPortfolioLink);
  const updateLink = useJobStore((state) => state.updatePortfolioLink);
  const deleteLink = useJobStore((state) => state.deletePortfolioLink);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PortfolioLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    type: 'project' as PortfolioLinkType,
  });

  const resetForm = () => {
    setFormData({ title: '', url: '', description: '', type: 'project' });
    setEditingLink(null);
  };

  const handleOpenDialog = (link?: PortfolioLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description || '',
        type: link.type,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.url) {
      toast.error('Please fill in title and URL');
      return;
    }

    if (editingLink) {
      updateLink(editingLink.id, {
        title: formData.title,
        url: formData.url,
        description: formData.description || undefined,
        type: formData.type,
      });
      toast.success('Link updated');
    } else {
      const newLink: PortfolioLink = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        title: formData.title,
        url: formData.url,
        description: formData.description || undefined,
        type: formData.type,
      };
      addLink(newLink);
      toast.success('Link added');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteLink(id);
    toast.success('Link deleted');
  };

  const typeLabels: Record<PortfolioLinkType, string> = {
    project: 'Project',
    website: 'Website',
    github: 'GitHub',
    demo: 'Demo',
    other: 'Other',
  };

  const typeColors: Record<PortfolioLinkType, string> = {
    project: 'bg-blue-100 text-blue-800',
    website: 'bg-green-100 text-green-800',
    github: 'bg-gray-100 text-gray-800',
    demo: 'bg-purple-100 text-purple-800',
    other: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Portfolio Links</h2>
          <p className="text-sm text-muted-foreground">
            Showcase your projects, websites, and work samples
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingLink ? 'Edit Link' : 'Add Portfolio Link'}</DialogTitle>
              <DialogDescription>
                Add a link to your portfolio, project, or work sample.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-title">Title</Label>
                <Input
                  id="link-title"
                  placeholder="e.g., Personal Portfolio"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as PortfolioLinkType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-description">Description (Optional)</Label>
                <Textarea
                  id="link-description"
                  placeholder="Brief description of this project or work..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingLink ? 'Save Changes' : 'Add Link'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No portfolio links yet.
              <br />
              Add links to your projects and work samples.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{link.title}</CardTitle>
                    <Badge className={`mt-1 ${typeColors[link.type]}`}>
                      {typeLabels[link.type]}
                    </Badge>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Open ${link.title} in new tab`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                {link.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {link.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(link)}
                  >
                    <Edit2 className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Certificates Section Component
function CertificatesSection() {
  const certificates = useJobStore((state) => state.certificates);
  const addCertificate = useJobStore((state) => state.addCertificate);
  const updateCertificate = useJobStore((state) => state.updateCertificate);
  const deleteCertificate = useJobStore((state) => state.deleteCertificate);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
    });
    setEditingCert(null);
  };

  const handleOpenDialog = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issue_date,
        expiry_date: cert.expiry_date || '',
        credential_id: cert.credential_id || '',
        credential_url: cert.credential_url || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.issuer || !formData.issue_date) {
      toast.error('Please fill in name, issuer, and issue date');
      return;
    }

    if (editingCert) {
      updateCertificate(editingCert.id, {
        name: formData.name,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date || undefined,
        credential_id: formData.credential_id || undefined,
        credential_url: formData.credential_url || undefined,
      });
      toast.success('Certificate updated');
    } else {
      const newCert: Certificate = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        name: formData.name,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date || undefined,
        credential_id: formData.credential_id || undefined,
        credential_url: formData.credential_url || undefined,
      };
      addCertificate(newCert);
      toast.success('Certificate added');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteCertificate(id);
    toast.success('Certificate deleted');
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry > new Date() && expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Certificates and Credentials</h2>
          <p className="text-sm text-muted-foreground">
            Track your professional certifications and credentials
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCert ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
              <DialogDescription>
                Add details about your professional certification or credential.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cert-name">Certificate Name</Label>
                <Input
                  id="cert-name"
                  placeholder="e.g., AWS Solutions Architect"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-issuer">Issuing Organization</Label>
                <Input
                  id="cert-issuer"
                  placeholder="e.g., Amazon Web Services"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-issue-date">Issue Date</Label>
                  <Input
                    id="cert-issue-date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-expiry-date">Expiry Date (Optional)</Label>
                  <Input
                    id="cert-expiry-date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-id">Credential ID (Optional)</Label>
                <Input
                  id="cert-id"
                  placeholder="e.g., ABC123XYZ"
                  value={formData.credential_id}
                  onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-url">Verification URL (Optional)</Label>
                <Input
                  id="cert-url"
                  type="url"
                  placeholder="https://..."
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingCert ? 'Save Changes' : 'Add Certificate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No certificates added yet.
              <br />
              Add your professional certifications and credentials.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                      <CardDescription>{cert.issuer}</CardDescription>
                    </div>
                  </div>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Verify ${cert.name} credential`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">
                    Issued: {format(new Date(cert.issue_date), 'MMM yyyy')}
                  </Badge>
                  {cert.expiry_date && (
                    <Badge
                      variant={
                        isExpired(cert.expiry_date)
                          ? 'destructive'
                          : isExpiringSoon(cert.expiry_date)
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {isExpired(cert.expiry_date) ? 'Expired: ' : 'Expires: '}
                      {format(new Date(cert.expiry_date), 'MMM yyyy')}
                    </Badge>
                  )}
                  {cert.credential_id && (
                    <Badge variant="secondary">ID: {cert.credential_id}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(cert)}
                  >
                    <Edit2 className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Documents Page Component
export default function DocumentsPage() {
  const resumes = useJobStore((state) => state.resumes);
  const templates = useJobStore((state) => state.coverLetterTemplates);
  const links = useJobStore((state) => state.portfolioLinks);
  const certificates = useJobStore((state) => state.certificates);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Manage your resumes, cover letters, portfolio, and credentials
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumes.length}</div>
            <p className="text-xs text-muted-foreground">
              {resumes.filter((r) => r.is_primary).length > 0 ? 'Primary set' : 'No primary'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              {templates.length} template{templates.length !== 1 ? 's' : ''} saved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{links.length}</div>
            <p className="text-xs text-muted-foreground">
              {links.length} project{links.length !== 1 ? 's' : ''} showcased
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">
              {certificates.length} credential{certificates.length !== 1 ? 's' : ''} tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Document Sections */}
      <Tabs defaultValue="resumes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="resumes" className="gap-2">
            <FileText className="h-4 w-4" />
            Resumes
          </TabsTrigger>
          <TabsTrigger value="cover-letters" className="gap-2">
            <FileText className="h-4 w-4" />
            Cover Letters
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumes">
          <ResumeSection />
        </TabsContent>

        <TabsContent value="cover-letters">
          <CoverLetterSection />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioSection />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificatesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
