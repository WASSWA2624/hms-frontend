/**
 * Error Handler
 * Normalizes errors to domain-safe objects
 * File: error.handler.js
 */
import en from '@i18n/locales/en.json';
import { logger } from '@logging';

const getNestedValue = (obj, path) => {
  return String(path)
    .split('.')
    .reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
};

const getSafeMessageForCode = (code) => {
  return (
    getNestedValue(en, `errors.codes.${code}`) ||
    getNestedValue(en, 'errors.codes.UNKNOWN_ERROR') ||
    'UNKNOWN_ERROR'
  );
};

/**
 * Extract error code from backend message
 * Backend may send translation keys like "errors.auth.invalid_credentials"
 * or already translated messages like "Invalid credentials"
 */
const extractErrorCode = (message) => {
  if (!message || typeof message !== 'string') {
    return 'UNKNOWN_ERROR';
  }

  // If message is a translation key (starts with "errors.")
  if (message.startsWith('errors.')) {
    // Extract the last part as code
    // "errors.auth.invalid_credentials" -> "INVALID_CREDENTIALS"
    // "errors.auth.multiple_tenants" -> "MULTIPLE_TENANTS"
    const parts = message.split('.');
    const lastPart = parts[parts.length - 1];
    // Convert snake_case to UPPER_SNAKE_CASE
    return lastPart.toUpperCase().replace(/-/g, '_');
  }

  // Map common translated messages to codes
  const messageLower = message.toLowerCase();
  if (messageLower.includes('invalid credential')) {
    return 'INVALID_CREDENTIALS';
  }
  if (messageLower.includes('authentication required') || messageLower.includes('unauthorized')) {
    return 'UNAUTHORIZED';
  }
  if (messageLower.includes('access denied') || messageLower.includes('forbidden') || messageLower.includes('insufficient permission')) {
    return 'FORBIDDEN';
  }
  if (messageLower.includes('multiple tenant') || messageLower.includes('tenant selection')) {
    return 'MULTIPLE_TENANTS';
  }
  if (messageLower.includes('pending verification')) {
    return 'ACCOUNT_PENDING';
  }
  if (messageLower.includes('suspended')) {
    return 'ACCOUNT_SUSPENDED';
  }
  if (messageLower.includes('not active') || messageLower.includes('inactive')) {
    return 'ACCOUNT_INACTIVE';
  }
  if (messageLower.includes('invalid or expired token') || messageLower.includes('invalid token')) {
    return 'TOKEN_INVALID';
  }
  if (messageLower.includes('already verified')) {
    return 'ALREADY_VERIFIED';
  }
  if (messageLower.includes('database') || messageLower.includes('server')) {
    return 'SERVER_ERROR';
  }

  return 'UNKNOWN_ERROR';
};

const createNormalizedError = (code, message, severity = 'error') => {
  const safeMessage = getSafeMessageForCode(code);
  const resolvedMessage =
    typeof message === 'string' && message.trim()
      ? message.trim()
      : safeMessage;

  return {
    code,
    message: resolvedMessage,
    safeMessage,
    severity,
  };
};

const normalizeError = (error) => {
  if (!error) {
    return createNormalizedError('UNKNOWN_ERROR');
  }

  // Network errors (browser often throws TypeError with "Failed to fetch")
  if (
    error.name === 'NetworkError' ||
    error.message?.includes('network') ||
    (typeof error.message === 'string' && error.message.toLowerCase().includes('failed to fetch'))
  ) {
    return createNormalizedError(
      'NETWORK_ERROR',
      getSafeMessageForCode('NETWORK_ERROR'),
      'warning'
    );
  }

  // API errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;

    // Extract error code from backend message if available
    const extractedCode = error.message ? extractErrorCode(error.message) : null;

    if (status === 401) {
      const code =
        extractedCode && extractedCode !== 'UNKNOWN_ERROR'
          ? extractedCode
          : 'UNAUTHORIZED';
      return createNormalizedError(code, getSafeMessageForCode(code));
    }

    if (status === 403) {
      const code =
        extractedCode && extractedCode !== 'UNKNOWN_ERROR'
          ? extractedCode
          : 'FORBIDDEN';
      return createNormalizedError(code, getSafeMessageForCode(code));
    }

    if (status >= 500) {
      const code =
        extractedCode && extractedCode !== 'UNKNOWN_ERROR'
          ? extractedCode
          : 'SERVER_ERROR';
      return createNormalizedError(code, getSafeMessageForCode(code));
    }

    // For other status codes, use extracted code or default
    if (extractedCode && extractedCode !== 'UNKNOWN_ERROR') {
      return createNormalizedError(extractedCode, error.message);
    }
  }

  const candidateCode =
    typeof error.code === 'string' && error.code.trim()
      ? error.code.trim()
      : extractErrorCode(error.message);
  const code = candidateCode || 'UNKNOWN_ERROR';

  // Default
  return createNormalizedError(code, error.message, error.severity || 'error');
};

const handleError = (error, context = {}) => {
  const normalized = normalizeError(error);
  logger.error('Handled error', {
    code: normalized.code,
    severity: normalized.severity,
    context: context && typeof context === 'object' ? context : {},
  });
  return normalized;
};

export { normalizeError, handleError };

