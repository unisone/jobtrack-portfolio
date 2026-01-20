/**
 * OAuth Callback Route Handler
 *
 * Handles the OAuth callback from providers (Google, GitHub).
 * Exchanges the authorization code for a session token.
 *
 * Security measures:
 * - Validates redirect URLs to prevent open redirect attacks
 * - Handles OAuth error parameters
 * - Logs errors server-side without exposing details to client
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { validateRedirectUrl } from '@/lib/auth/security';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // Extract OAuth parameters
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors (user denied access, provider error, etc.)
  if (error) {
    console.error('OAuth error:', error, errorDescription);

    const errorUrl = new URL('/auth/auth-code-error', origin);
    errorUrl.searchParams.set('error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('description', errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  // SECURITY: Validate redirect URL BEFORE any auth operations
  // This prevents open redirect attacks where an attacker could
  // craft a URL like /auth/callback?next=https://evil.com
  const safeRedirectPath = validateRedirectUrl(next);

  // Exchange the authorization code for a session
  if (code) {
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (!authError) {
      // Success - redirect to the validated safe path
      return NextResponse.redirect(`${origin}${safeRedirectPath}`);
    }

    // Log the error server-side (not exposed to client)
    console.error('Auth callback error:', authError.message);
  }

  // Redirect to error page on any failure
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
