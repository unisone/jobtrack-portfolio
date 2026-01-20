'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSupabaseSync, UseSupabaseSyncReturn } from '@/hooks/useSupabaseSync';

const SyncContext = createContext<UseSupabaseSyncReturn | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const sync = useSupabaseSync();

  return (
    <SyncContext.Provider value={sync}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync(): UseSupabaseSyncReturn {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
