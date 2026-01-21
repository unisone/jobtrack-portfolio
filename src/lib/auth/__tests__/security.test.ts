/**
 * Security Utilities Tests
 *
 * Tests for validateRedirectUrl to ensure it prevents open redirect attacks
 */

import { validateRedirectUrl, sanitizeAuthError } from '../security';

describe('validateRedirectUrl', () => {
  describe('should block malicious redirects', () => {
    it('blocks external URLs (https://evil.com)', () => {
      expect(validateRedirectUrl('https://evil.com')).toBe('/');
    });

    it('blocks protocol-relative URLs (//evil.com)', () => {
      expect(validateRedirectUrl('//evil.com')).toBe('/');
    });

    it('blocks URLs with encoded slashes', () => {
      expect(validateRedirectUrl('%2f%2fevil.com')).toBe('/');
    });

    it('blocks URLs with javascript protocol', () => {
      expect(validateRedirectUrl('javascript:alert(1)')).toBe('/');
    });

    it('blocks URLs with data protocol', () => {
      expect(validateRedirectUrl('data:text/html,<script>alert(1)</script>')).toBe('/');
    });

    it('blocks paths not in whitelist', () => {
      expect(validateRedirectUrl('/admin/secret')).toBe('/');
      expect(validateRedirectUrl('/api/private')).toBe('/');
    });
  });

  describe('should allow safe redirects', () => {
    it('allows root path', () => {
      expect(validateRedirectUrl('/')).toBe('/');
    });

    it('allows /jobs path', () => {
      expect(validateRedirectUrl('/jobs')).toBe('/jobs');
    });

    it('allows /profile path', () => {
      expect(validateRedirectUrl('/profile')).toBe('/profile');
    });

    it('allows /settings path', () => {
      expect(validateRedirectUrl('/settings')).toBe('/settings');
    });

    it('allows /analytics path', () => {
      expect(validateRedirectUrl('/analytics')).toBe('/analytics');
    });

    it('allows /documents path', () => {
      expect(validateRedirectUrl('/documents')).toBe('/documents');
    });

    it('allows /goals path', () => {
      expect(validateRedirectUrl('/goals')).toBe('/goals');
    });

    it('allows /import path', () => {
      expect(validateRedirectUrl('/import')).toBe('/import');
    });

    it('allows /resumes path', () => {
      expect(validateRedirectUrl('/resumes')).toBe('/resumes');
    });
  });

  describe('should handle edge cases', () => {
    it('returns / for null', () => {
      expect(validateRedirectUrl(null)).toBe('/');
    });

    it('returns / for undefined', () => {
      expect(validateRedirectUrl(undefined)).toBe('/');
    });

    it('returns / for empty string', () => {
      expect(validateRedirectUrl('')).toBe('/');
    });

    it('returns / for whitespace only', () => {
      expect(validateRedirectUrl('   ')).toBe('/');
    });

    it('trims whitespace from valid paths', () => {
      expect(validateRedirectUrl('  /jobs  ')).toBe('/jobs');
    });
  });
});

describe('sanitizeAuthError', () => {
  it('returns generic message for unknown errors', () => {
    const result = sanitizeAuthError(new Error('Database connection failed'));
    expect(result).toBe('An error occurred. Please try again.');
  });

  it('sanitizes invalid credentials error', () => {
    const result = sanitizeAuthError({
      message: 'Invalid login credentials',
      status: 400,
    });
    expect(result).toBe('Invalid email or password');
  });

  it('sanitizes email not confirmed error', () => {
    const result = sanitizeAuthError({
      message: 'Email not confirmed',
      status: 400,
    });
    expect(result).toBe('Please verify your email address before signing in.');
  });

  it('handles non-Error objects', () => {
    const result = sanitizeAuthError('some string error');
    expect(result).toBe('An error occurred. Please try again.');
  });

  it('handles null/undefined', () => {
    expect(sanitizeAuthError(null)).toBe('An error occurred. Please try again.');
    expect(sanitizeAuthError(undefined)).toBe('An error occurred. Please try again.');
  });
});
