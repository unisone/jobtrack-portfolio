import { createBrowserClient } from '@supabase/ssr';

/**
 * Create a Supabase browser client
 *
 * Handles missing env vars gracefully during build-time static generation.
 * In production runtime, env vars will be properly injected by Vercel.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build-time static generation, env vars may not be available
  // Return a client with placeholder values that will fail gracefully
  // In production runtime, real values are injected
  if (!supabaseUrl || !supabaseKey) {
    // Use placeholder values - these pages will be dynamic anyway
    // This prevents build crashes while allowing static analysis
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
