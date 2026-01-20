/**
 * Authentication Security Utilities
 *
 * This module provides security functions for:
 * - URL validation to prevent open redirect attacks
 * - Error message sanitization to prevent information leakage
 * - OAuth state generation for CSRF protection
 */

import { AUTH_CONFIG, type AllowedRedirectPath } from './constants';

/**
 * Validates and sanitizes a redirect URL to prevent open redirect attacks.
 *
 * Security considerations:
 * - Only allows relative paths (starting with /)
 * - Blocks protocol-relative URLs (//evil.com)
 * - Uses a whitelist of allowed paths
 * - Falls back to '/' for any invalid input
 *
 * @param url - The URL to validate (can be null/undefined)
 * @returns A safe redirect path
 */
export function validateRedirectUrl(url: string | null | undefined): string {
  // Default to home if no URL provided
  if (!url) return '/';

  // Remove any leading/trailing whitespace
  const trimmed = url.trim();

  // Must start with / (relative path only - prevents http://evil.com)
  if (!trimmed.startsWith('/')) return '/';

  // Prevent protocol-relative URLs (//evil.com would redirect to evil.com)
  if (trimmed.startsWith('//')) return '/';

  // Prevent encoded characters that could bypass checks
  if (trimmed.includes('%')) {
    try {
      const decoded = decodeURIComponent(trimmed);
      if (decoded.startsWith('//') || !decoded.startsWith('/')) {
        return '/';
      }
    } catch {
      // Invalid encoding, reject
      return '/';
    }
  }

  // Parse and validate path against whitelist
  try {
    // Use URL constructor to properly parse the path
    const parsed = new URL(trimmed, 'http://localhost');
    const path = parsed.pathname;

    // Check against whitelist of allowed paths
    const isAllowed = AUTH_CONFIG.ALLOWED_REDIRECT_PATHS.some(
      (allowed: AllowedRedirectPath) =>
        path === allowed || path.startsWith(`${allowed}/`)
    );

    return isAllowed ? path : '/';
  } catch {
    // Any parsing error, fall back to safe default
    return '/';
  }
}

/**
 * Sanitizes error messages to prevent information leakage.
 *
 * Security considerations:
 * - Maps specific Supabase errors to generic user-friendly messages
 * - Prevents email enumeration attacks
 * - Hides internal error details from users
 *
 * @param error - The error object or message
 * @returns A safe, user-friendly error message
 */
export function sanitizeAuthError(error: unknown): string {
  if (!error) return AUTH_CONFIG.ERRORS.GENERIC;

  // Extract error message
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

  const lowerMessage = message.toLowerCase();

  // Map specific Supabase/Auth errors to safe messages
  // Order matters - more specific checks first
  const errorMappings: Array<{ pattern: string; response: string }> = [
    { pattern: 'invalid login credentials', response: AUTH_CONFIG.ERRORS.INVALID_CREDENTIALS },
    { pattern: 'invalid email or password', response: AUTH_CONFIG.ERRORS.INVALID_CREDENTIALS },
    { pattern: 'email not confirmed', response: AUTH_CONFIG.ERRORS.EMAIL_NOT_VERIFIED },
    { pattern: 'email link is invalid', response: AUTH_CONFIG.ERRORS.INVALID_RESET_TOKEN },
    { pattern: 'token has expired', response: AUTH_CONFIG.ERRORS.INVALID_RESET_TOKEN },
    { pattern: 'password should', response: AUTH_CONFIG.ERRORS.WEAK_PASSWORD },
    { pattern: 'too many requests', response: AUTH_CONFIG.ERRORS.RATE_LIMITED },
    { pattern: 'rate limit', response: AUTH_CONFIG.ERRORS.RATE_LIMITED },
    { pattern: 'user already registered', response: AUTH_CONFIG.ERRORS.USER_EXISTS },
    { pattern: 'already exists', response: AUTH_CONFIG.ERRORS.USER_EXISTS },
    { pattern: 'network', response: AUTH_CONFIG.ERRORS.NETWORK },
    { pattern: 'fetch failed', response: AUTH_CONFIG.ERRORS.NETWORK },
  ];

  for (const { pattern, response } of errorMappings) {
    if (lowerMessage.includes(pattern)) {
      return response;
    }
  }

  // Default to generic error to prevent information leakage
  return AUTH_CONFIG.ERRORS.GENERIC;
}

/**
 * Generates a cryptographically secure random state for OAuth.
 *
 * This is used for CSRF protection in OAuth flows. The state is:
 * - Generated using the Web Crypto API for security
 * - 32 bytes (256 bits) of randomness
 * - Encoded as a hexadecimal string
 *
 * Note: Supabase handles state internally, but this is available
 * for custom OAuth implementations if needed.
 *
 * @returns A secure random string for OAuth state parameter
 */
export function generateOAuthState(): string {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // Server-side fallback using Node.js crypto
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  }

  // Last resort fallback (should never reach this in modern environments)
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Checks if an error indicates the user needs to verify their email.
 *
 * @param error - The error to check
 * @returns True if email verification is required
 */
export function isEmailVerificationError(error: unknown): boolean {
  if (!error) return false;

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

  return message.toLowerCase().includes('email not confirmed');
}

/**
 * Checks if an error indicates rate limiting.
 *
 * @param error - The error to check
 * @returns True if the user is rate limited
 */
export function isRateLimitError(error: unknown): boolean {
  if (!error) return false;

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests');
}
