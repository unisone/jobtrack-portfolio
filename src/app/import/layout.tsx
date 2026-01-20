'use client';

import { Suspense } from 'react';
import { SyncProvider } from '@/components/providers/sync-provider';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground mt-3">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Import Layout
 *
 * Provides SyncProvider for the import page without the full dashboard chrome.
 * Wrapped in Suspense for useSearchParams support.
 */
export default function ImportLayout({ children }: { children: React.ReactNode }) {
  return (
    <SyncProvider>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </SyncProvider>
  );
}
