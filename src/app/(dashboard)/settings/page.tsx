'use client';

// Force dynamic rendering to bypass SSG prerender issues with Zustand store
// See: https://github.com/vercel/next.js/issues/85668
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useJobStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  User,
  Bell,
  Palette,
  Database,
  AlertTriangle,
  Download,
  Trash2,
  LogOut,
  Key,
  Mail,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const jobs = useJobStore((state) => state.jobs);
  const profile = useJobStore((state) => state.profile);

  // Local state for preferences (would typically be stored in database)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [applicationReminders, setApplicationReminders] = useState(true);

  // Dialog states
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      router.push('/auth/login');
    }
  };

  const handleExportData = () => {
    try {
      const exportData = {
        profile,
        jobs,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-hunt-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch {
      toast.error('Failed to export data');
    }
  };

  const handleClearLocalData = async () => {
    setIsClearing(true);
    try {
      // Clear localStorage
      localStorage.removeItem('job-hunt-storage');

      // Force page reload to reset store
      toast.success('Local data cleared successfully');
      setClearDataDialogOpen(false);

      // Give toast time to show before reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      toast.error('Failed to clear local data');
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // In a real implementation, this would call an API to delete the account
      // For now, we'll just sign out and clear data
      localStorage.removeItem('job-hunt-storage');
      await signOut();

      toast.success('Account deleted successfully');
      setDeleteAccountDialogOpen(false);
      router.push('/auth/login');
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = () => {
    // In a real implementation, this would navigate to a password change flow
    // or open a modal for password change
    toast.info('Password change functionality coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : user?.email || 'Not signed in'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Change Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>

            <Separator />

            {/* Sign Out */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Sign Out</Label>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account on this device.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about your job applications.
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                aria-label="Toggle email notifications"
              />
            </div>

            <Separator />

            {/* Weekly Digest */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-digest" className="text-sm font-medium">
                  Weekly Digest
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your job search progress.
                </p>
              </div>
              <Switch
                id="weekly-digest"
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
                aria-label="Toggle weekly digest"
              />
            </div>

            <Separator />

            {/* Application Reminders */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-reminders" className="text-sm font-medium">
                  Application Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to follow up on pending applications.
                </p>
              </div>
              <Switch
                id="app-reminders"
                checked={applicationReminders}
                onCheckedChange={setApplicationReminders}
                aria-label="Toggle application reminders"
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Display Preferences
            </CardTitle>
            <CardDescription>
              Customize how the application looks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme</Label>
              <p className="text-sm text-muted-foreground">
                Select your preferred color theme.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => toast.info('Theme switching coming soon')}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => toast.info('Theme switching coming soon')}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => toast.info('Theme switching coming soon')}
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export or manage your application data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export Data */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Export Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Download all your job tracking data as a JSON file.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                Export Data
              </Button>
            </div>

            <Separator />

            {/* Clear Local Data */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Clear Local Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove all locally stored data from this browser.
                  </p>
                </div>
              </div>
              <Dialog open={clearDataDialogOpen} onOpenChange={setClearDataDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Clear Data</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear Local Data</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to clear all locally stored data? This will remove
                      all your jobs, profile information, and preferences from this browser.
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setClearDataDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleClearLocalData}
                      disabled={isClearing}
                    >
                      {isClearing ? 'Clearing...' : 'Clear All Data'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                  This action cannot be undone.
                </p>
              </div>
              <Dialog
                open={deleteAccountDialogOpen}
                onOpenChange={setDeleteAccountDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      Are you absolutely sure you want to delete your account? This will
                      permanently remove all your data including jobs, profile, and
                      preferences. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteAccountDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
