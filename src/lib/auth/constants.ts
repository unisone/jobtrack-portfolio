/**
 * Authentication Configuration Constants
 *
 * Centralized configuration for all auth-related settings.
 * This ensures consistency and makes security policies easy to audit.
 */

export const AUTH_CONFIG = {
  // Password requirements (OWASP recommendations)
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false, // Kept optional for UX
  },

  // Session configuration
  SESSION: {
    EXPIRY_WARNING_MS: 5 * 60 * 1000, // 5 minutes before expiry
    IDLE_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  },

  // Rate limiting thresholds (for reference - enforced by Supabase)
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
    PASSWORD_RESET_ATTEMPTS: 3,
  },

  // Allowed redirect paths (whitelist approach for security)
  ALLOWED_REDIRECT_PATHS: [
    '/',
    '/jobs',
    '/profile',
    '/documents',
    '/goals',
    '/analytics',
    '/settings',
    '/import',
    '/resumes',
  ] as const,

  // Sanitized error messages (prevent information leakage)
  ERRORS: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account temporarily locked. Please try again later.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in.',
    RATE_LIMITED: 'Too many attempts. Please try again later.',
    WEAK_PASSWORD: 'Password does not meet security requirements.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    USER_EXISTS: 'An account with this email already exists.',
    INVALID_RESET_TOKEN: 'This password reset link is invalid or has expired.',
    GENERIC: 'An error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
  },

  // OAuth error code mappings
  OAUTH_ERRORS: {
    access_denied: {
      title: 'Access Denied',
      description: 'You declined the authorization request or it was cancelled.',
    },
    invalid_request: {
      title: 'Invalid Request',
      description: 'The authorization request was malformed. Please try again.',
    },
    unauthorized_client: {
      title: 'Unauthorized',
      description: 'The application is not authorized to request access.',
    },
    server_error: {
      title: 'Server Error',
      description: 'The authentication server encountered an error. Please try again.',
    },
    temporarily_unavailable: {
      title: 'Service Unavailable',
      description: 'The authentication service is temporarily unavailable. Please try again later.',
    },
    default: {
      title: 'Authentication Failed',
      description: 'Something went wrong during sign in. Please try again.',
    },
  },
} as const;

// Type exports for type safety
export type AllowedRedirectPath = (typeof AUTH_CONFIG.ALLOWED_REDIRECT_PATHS)[number];
export type AuthErrorKey = keyof typeof AUTH_CONFIG.ERRORS;
export type OAuthErrorCode = keyof typeof AUTH_CONFIG.OAUTH_ERRORS;
