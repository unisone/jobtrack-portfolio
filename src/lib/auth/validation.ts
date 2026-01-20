/**
 * Authentication Validation Schemas
 *
 * Zod schemas for validating auth forms with:
 * - Strong password requirements
 * - Email validation
 * - Password strength calculation
 */

import { z } from 'zod';
import { AUTH_CONFIG } from './constants';

const { PASSWORD } = AUTH_CONFIG;

/**
 * Password validation schema with configurable strength requirements.
 *
 * Requirements (from AUTH_CONFIG):
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const passwordSchema = z
  .string()
  .min(
    PASSWORD.MIN_LENGTH,
    `Password must be at least ${PASSWORD.MIN_LENGTH} characters`
  )
  .max(
    PASSWORD.MAX_LENGTH,
    `Password must be at most ${PASSWORD.MAX_LENGTH} characters`
  )
  .refine(
    (val) => !PASSWORD.REQUIRE_UPPERCASE || /[A-Z]/.test(val),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (val) => !PASSWORD.REQUIRE_LOWERCASE || /[a-z]/.test(val),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (val) => !PASSWORD.REQUIRE_NUMBER || /\d/.test(val),
    'Password must contain at least one number'
  );

/**
 * Email validation schema with normalization.
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

/**
 * Full name validation schema.
 */
export const fullNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters')
  .trim();

/**
 * Login form validation schema.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Signup form validation schema with password confirmation.
 */
export const signupSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_CONFIG.ERRORS.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Forgot password form validation schema.
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password form validation schema.
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_CONFIG.ERRORS.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * Password strength result
 */
export interface PasswordStrengthResult {
  score: number;
  maxScore: number;
  label: PasswordStrength;
  percentage: number;
  suggestions: string[];
}

/**
 * Calculates password strength with visual feedback.
 *
 * Scoring criteria:
 * - Length >= 8: +1 point
 * - Length >= 12: +1 point
 * - Length >= 16: +1 point
 * - Contains lowercase: +1 point
 * - Contains uppercase: +1 point
 * - Contains number: +1 point
 * - Contains special char: +1 point
 * - No common patterns: +1 point
 *
 * @param password - The password to evaluate
 * @returns Strength analysis with score, label, and suggestions
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const maxScore = 8;
  let score = 0;
  const suggestions: string[] = [];

  if (!password) {
    return {
      score: 0,
      maxScore,
      label: 'weak',
      percentage: 0,
      suggestions: ['Enter a password'],
    };
  }

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Check for common patterns (deduct if found)
  const commonPatterns = [
    /^password/i,
    /^12345/,
    /^qwerty/i,
    /^abc123/i,
    /(.)\1{2,}/, // Repeated characters
  ];
  const hasCommonPattern = commonPatterns.some((pattern) => pattern.test(password));
  if (!hasCommonPattern) score += 1;

  // Generate suggestions
  if (password.length < 12) {
    suggestions.push('Use 12+ characters for better security');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push('Add special characters (!@#$%^&*)');
  }
  if (!/\d/.test(password)) {
    suggestions.push('Add numbers');
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters');
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters');
  }
  if (hasCommonPattern) {
    suggestions.push('Avoid common patterns');
  }

  // Determine label based on score
  let label: PasswordStrength;
  if (score <= 2) {
    label = 'weak';
  } else if (score <= 4) {
    label = 'fair';
  } else if (score <= 6) {
    label = 'good';
  } else {
    label = 'strong';
  }

  return {
    score,
    maxScore,
    label,
    percentage: Math.round((score / maxScore) * 100),
    suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
  };
}

/**
 * Gets the color class for a password strength level.
 *
 * @param strength - The strength label
 * @returns Tailwind color class
 */
export function getStrengthColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    weak: 'bg-red-500',
    fair: 'bg-yellow-500',
    good: 'bg-blue-500',
    strong: 'bg-emerald-500',
  };
  return colors[strength];
}

/**
 * Gets the text color class for a password strength level.
 *
 * @param strength - The strength label
 * @returns Tailwind text color class
 */
export function getStrengthTextColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    weak: 'text-red-500',
    fair: 'text-yellow-500',
    good: 'text-blue-500',
    strong: 'text-emerald-500',
  };
  return colors[strength];
}

/**
 * Validates a password and returns validation errors.
 *
 * @param password - The password to validate
 * @returns Array of validation error messages
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];

  if (password.length < PASSWORD.MIN_LENGTH) {
    errors.push(`At least ${PASSWORD.MIN_LENGTH} characters`);
  }
  if (PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }
  if (PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }
  if (PASSWORD.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('One number');
  }
  if (PASSWORD.REQUIRE_SPECIAL && !/[^a-zA-Z0-9]/.test(password)) {
    errors.push('One special character');
  }

  return errors;
}
