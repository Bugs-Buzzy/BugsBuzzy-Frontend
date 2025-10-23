import { describe, it, expect } from 'vitest';

import { validateEmail, getEmailError } from './validation';

describe('Email Validation', () => {
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
      expect(validateEmail('name+tag@example.org')).toBe(true);
      expect(validateEmail('user123@test-domain.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@invalid.com')).toBe(false);
      expect(validateEmail('invalid@.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
      expect(validateEmail('invalid @domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('getEmailError', () => {
    it('should return error for empty email', () => {
      expect(getEmailError('')).toBe('ایمیل الزامی است');
    });

    it('should return error for invalid format', () => {
      expect(getEmailError('invalid')).toBe('فرمت ایمیل صحیح نیست');
      expect(getEmailError('test@')).toBe('فرمت ایمیل صحیح نیست');
    });

    it('should return null for valid email', () => {
      expect(getEmailError('user@example.com')).toBe(null);
      expect(getEmailError('test@domain.co.uk')).toBe(null);
    });
  });
});
