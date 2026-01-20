/**
 * Validator Utilities Tests
 * File: validator.test.js
 */

import { isValidEmail, isValidUrl } from '@utils';

describe('Validator Utilities', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('invalid@example')).toBe(false);
      expect(isValidEmail('invalid..email@example.com')).toBe(false);
    });

    test('should handle whitespace by trimming', () => {
      expect(isValidEmail('  test@example.com  ')).toBe(true);
      expect(isValidEmail(' test@example.com')).toBe(true);
      expect(isValidEmail('test@example.com ')).toBe(true);
    });

    test('should return false for null', () => {
      expect(isValidEmail(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isValidEmail(undefined)).toBe(false);
    });

    test('should return false for non-string', () => {
      expect(isValidEmail(123)).toBe(false);
      expect(isValidEmail({})).toBe(false);
      expect(isValidEmail([])).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('   ')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    test('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com:8080/path?query=value')).toBe(true);
    });

    test('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });

    test('should return false for null', () => {
      expect(isValidUrl(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isValidUrl(undefined)).toBe(false);
    });

    test('should return false for non-string', () => {
      expect(isValidUrl(123)).toBe(false);
      expect(isValidUrl({})).toBe(false);
      expect(isValidUrl([])).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isValidUrl('')).toBe(false);
    });
  });
});

