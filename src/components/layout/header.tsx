'use client';

import { Bell, Search, Plus, Cloud, CloudOff, RefreshCw, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useJobStore } from '@/lib/store';
import { useSync } from '@/components/providers/sync-provider';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface HeaderProps {
  onAddJob?: () => void;
}

export function Header({ onAddJob }: HeaderProps) {
  const profile = useJobStore((state) => state.profile);
  const { status, syncNow } = useSync();
  const { signOut } = useAuth();

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : status.user?.email?.charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs, companies..." className="w-80 pl-10" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Sync Status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={syncNow}
                disabled={status.isSyncing || !status.user}
                className="relative"
              >
                {status.isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : status.isOnline && status.user ? (
                  <Cloud className="h-4 w-4 text-green-500" />
                ) : (
                  <CloudOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {status.isSyncing ? (
                'Syncing...'
              ) : status.user ? (
                status.isOnline ? (
                  status.lastSyncedAt ? (
                    `Synced ${status.lastSyncedAt.toLocaleTimeString()}`
                  ) : (
                    'Click to sync'
                  )
                ) : (
                  'Offline - changes saved locally'
                )
              ) : (
                'Sign in to enable cloud sync'
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button onClick={onAddJob} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            2
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.portfolio_url} alt={profile?.full_name || 'User'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {status.user && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-green-500 ring-2 ring-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {profile?.full_name || status.user?.email?.split('@')[0] || 'Guest'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status.user?.email || 'Not signed in'}
                </p>
                {status.user && (
                  <Badge variant="secondary" className="w-fit text-xs mt-1">
                    <Cloud className="h-3 w-3 mr-1" />
                    Cloud Sync Active
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {status.user ? (
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/auth/login" className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
