'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client-only components to prevent SSG issues
const Toaster = dynamic(
  () => import('@/components/ui/sonner').then((mod) => mod.Toaster),
  { ssr: false }
);

const ServiceWorkerRegister = dynamic(
  () => import('@/components/pwa/service-worker-register').then((mod) => mod.ServiceWorkerRegister),
  { ssr: false }
);

/**
 * Client-side only providers and components
 * Separated from layout to avoid SSG/SSR issues with React context
 */
export function ClientProviders() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until client-side to prevent SSG issues
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <ServiceWorkerRegister />
    </>
  );
}
