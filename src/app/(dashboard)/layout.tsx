'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SyncProvider } from '@/components/providers/sync-provider';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus, Bell, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { useSync } from '@/components/providers/sync-provider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

// Breadcrumb labels for routes
const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/jobs': 'Jobs',
  '/profile': 'Profile',
  '/documents': 'Documents',
  '/goals': 'Goals',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

function DashboardHeader() {
  const pathname = usePathname();
  const { status, syncNow } = useSync();

  const currentLabel = routeLabels[pathname] || 'Dashboard';
  const isHome = pathname === '/';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {!isHome && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        {/* Sync Status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={syncNow}
                disabled={status.isSyncing || !status.user}
                className="relative size-8"
                aria-label={
                  status.isSyncing
                    ? 'Syncing data'
                    : status.user
                      ? 'Sync with cloud'
                      : 'Sign in to enable sync'
                }
              >
                {status.isSyncing ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : status.isOnline && status.user ? (
                  <Cloud className="size-4 text-emerald-500" />
                ) : (
                  <CloudOff className="size-4 text-muted-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {status.isSyncing
                ? 'Syncing...'
                : status.user
                  ? status.isOnline
                    ? status.lastSyncedAt
                      ? `Synced ${status.lastSyncedAt.toLocaleTimeString()}`
                      : 'Click to sync'
                    : 'Offline - changes saved locally'
                  : 'Sign in to enable cloud sync'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications - badge hidden until feature is implemented */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        {/* Quick Add */}
        {pathname === '/jobs' || pathname === '/' ? null : (
          <Button size="sm" asChild>
            <Link href="/jobs">
              <Plus className="mr-1.5 size-4" />
              Add Job
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 page-enter">{children}</div>
      </main>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SyncProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardContent>{children}</DashboardContent>
        </SidebarInset>
      </SidebarProvider>
    </SyncProvider>
  );
}
