'use client';

/**
 * Authentication Hook
 *
 * Provides auth state and methods for the application.
 * Features:
 * - Secure OAuth with validated redirect URLs
 * - Sanitized error messages
 * - Real-time auth state sync
 * - Password management
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { validateRedirectUrl, sanitizeAuthError } from '@/lib/auth/security';
import type { User, AuthError, AuthResponse } from '@supabase/supabase-js';

/**
 * Standard auth result type with sanitized errors
 */
interface AuthResult<T = unknown> {
  data: T | null;
  error: AuthError | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the Supabase client to prevent unnecessary re-renders
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle specific auth events for state management
      switch (event) {
        case 'SIGNED_IN':
        case 'SIGNED_OUT':
        case 'TOKEN_REFRESHED':
        case 'PASSWORD_RECOVERY':
        case 'USER_UPDATED':
          // Auth state already updated via session above
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult<AuthResponse['data']>> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        return {
          data: null,
          error: {
            ...error,
            message: sanitizeAuthError(error),
          } as AuthError,
        };
      }

      return { data, error: null };
    },
    [supabase.auth]
  );

  /**
   * Sign up with email, password, and full name
   * Redirects to email verification page
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string
    ): Promise<AuthResult<AuthResponse['data']>> => {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-email?success=true`,
        },
      });

      if (error) {
        return {
          data: null,
          error: {
            ...error,
            message: sanitizeAuthError(error),
          } as AuthError,
        };
      }

      return { data, error: null };
    },
    [supabase.auth]
  );

  /**
   * Sign in with Google OAuth
   * Validates redirect URL to prevent open redirect attacks
   */
  const signInWithGoogle = useCallback(
    async (redirectAfterLogin?: string): Promise<AuthResult> => {
      // SECURITY: Validate the redirect URL
      const safeRedirect = validateRedirectUrl(redirectAfterLogin);
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
        },
      });

      return { data, error };
    },
    [supabase.auth]
  );

  /**
   * Sign in with GitHub OAuth
   * Validates redirect URL to prevent open redirect attacks
   */
  const signInWithGitHub = useCallback(
    async (redirectAfterLogin?: string): Promise<AuthResult> => {
      // SECURITY: Validate the redirect URL
      const safeRedirect = validateRedirectUrl(redirectAfterLogin);
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: callbackUrl,
        },
      });

      return { data, error };
    },
    [supabase.auth]
  );

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, [supabase.auth]);

  /**
   * Send password reset email
   */
  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        return {
          data: null,
          error: {
            ...error,
            message: sanitizeAuthError(error),
          } as AuthError,
        };
      }

      return { data, error: null };
    },
    [supabase.auth]
  );

  /**
   * Update the current user's password
   * Must be called when user has an active session (e.g., after clicking reset link)
   */
  const updatePassword = useCallback(
    async (newPassword: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          data: null,
          error: {
            ...error,
            message: sanitizeAuthError(error),
          } as AuthError,
        };
      }

      return { data, error: null };
    },
    [supabase.auth]
  );

  /**
   * Update the current user's profile
   */
  const updateProfile = useCallback(
    async (updates: { full_name?: string; avatar_url?: string }): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        return {
          data: null,
          error: {
            ...error,
            message: sanitizeAuthError(error),
          } as AuthError,
        };
      }

      return { data, error: null };
    },
    [supabase.auth]
  );

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };
}
