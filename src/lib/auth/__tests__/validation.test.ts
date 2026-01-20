/**
 * Validation Utilities Tests
 *
 * Tests for password validation schemas and strength calculation
 */

import {
  passwordSchema,
  loginSchema,
  signupSchema,
  calculatePasswordStrength,
  getPasswordErrors,
} from '../validation';

describe('passwordSchema', () => {
  describe('should reject weak passwords', () => {
    it('rejects passwords shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Ab1cdef');
      expect(result.success).toBe(false);
    });

    it('rejects passwords without uppercase', () => {
      const result = passwordSchema.safeParse('abcdefgh1');
      expect(result.success).toBe(false);
    });

    it('rejects passwords without lowercase', () => {
      const result = passwordSchema.safeParse('ABCDEFGH1');
      expect(result.success).toBe(false);
    });

    it('rejects passwords without numbers', () => {
      const result = passwordSchema.safeParse('Abcdefghi');
      expect(result.success).toBe(false);
    });
  });

  describe('should accept strong passwords', () => {
    it('accepts a password meeting all requirements', () => {
      const result = passwordSchema.safeParse('MySecure1');
      expect(result.success).toBe(true);
    });

    it('accepts passwords with special characters', () => {
      const result = passwordSchema.safeParse('MySecure1!@#');
      expect(result.success).toBe(true);
    });

    it('accepts long passwords', () => {
      const result = passwordSchema.safeParse('ThisIsAVeryLongPassword123');
      expect(result.success).toBe(true);
    });
  });
});

describe('loginSchema', () => {
  it('validates correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('validates correct signup data', () => {
    const result = signupSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'MySecure1',
      confirmPassword: 'MySecure1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'MySecure1',
      confirmPassword: 'MySecure2',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Passwords do not match');
    }
  });

  it('rejects empty full name', () => {
    const result = signupSchema.safeParse({
      fullName: '',
      email: 'john@example.com',
      password: 'MySecure1',
      confirmPassword: 'MySecure1',
    });
    expect(result.success).toBe(false);
  });
});

describe('calculatePasswordStrength', () => {
  it('returns weak for short passwords', () => {
    const result = calculatePasswordStrength('abc');
    expect(result.label).toBe('weak');
    expect(result.score).toBeLessThan(3);
  });

  it('returns weak for common passwords', () => {
    const result = calculatePasswordStrength('password');
    expect(result.label).toBe('weak');
  });

  it('returns fair for medium-strength passwords', () => {
    const result = calculatePasswordStrength('Abcdef1');
    expect(['weak', 'fair']).toContain(result.label);
  });

  it('returns strong for good passwords', () => {
    const result = calculatePasswordStrength('MySecure1Pass');
    expect(['fair', 'strong', 'very strong']).toContain(result.label);
  });

  it('returns very strong for excellent passwords', () => {
    const result = calculatePasswordStrength('MyV3ryStr0ng!P@ssw0rd');
    expect(['strong', 'very strong']).toContain(result.label);
  });

  it('percentage increases with strength', () => {
    const weak = calculatePasswordStrength('abc');
    const strong = calculatePasswordStrength('MyV3ryStr0ng!P@ss');
    expect(strong.percentage).toBeGreaterThan(weak.percentage);
  });
});

describe('getPasswordErrors', () => {
  it('returns error for missing length', () => {
    const errors = getPasswordErrors('Ab1');
    expect(errors.some((e) => e.includes('8'))).toBe(true);
  });

  it('returns error for missing uppercase', () => {
    const errors = getPasswordErrors('abcdefgh1');
    expect(errors.some((e) => e.toLowerCase().includes('uppercase'))).toBe(true);
  });

  it('returns error for missing lowercase', () => {
    const errors = getPasswordErrors('ABCDEFGH1');
    expect(errors.some((e) => e.toLowerCase().includes('lowercase'))).toBe(true);
  });

  it('returns error for missing number', () => {
    const errors = getPasswordErrors('Abcdefghi');
    expect(errors.some((e) => e.toLowerCase().includes('number'))).toBe(true);
  });

  it('returns empty array for valid password', () => {
    const errors = getPasswordErrors('MySecure1');
    expect(errors).toHaveLength(0);
  });
});
