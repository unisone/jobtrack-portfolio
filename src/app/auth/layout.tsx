/**
 * Auth Layout
 *
 * Forces dynamic rendering for all auth pages.
 * This is necessary because auth pages use Supabase client which requires
 * environment variables that aren't available during static generation.
 */

// Force dynamic rendering - don't try to statically generate auth pages
export const dynamic = 'force-dynamic';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
