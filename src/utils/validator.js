/**
 * Validation Utilities
 * Pure validation functions
 * File: validator.js
 */

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const value = email.trim();
  if (!value) return false;
  if (value.includes('..')) return false;

  // Intentionally simple and deterministic; avoids false-positives like "@example.com"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export { isValidEmail, isValidUrl };

