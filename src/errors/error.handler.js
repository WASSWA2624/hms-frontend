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

const normalizeError = (error) => {
  if (!error) {
    const safeMessage = getSafeMessageForCode('UNKNOWN_ERROR');
    return {
      code: 'UNKNOWN_ERROR',
      message: safeMessage,
      safeMessage,
      severity: 'error',
    };
  }

  // Network errors
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    const safeMessage = getSafeMessageForCode('NETWORK_ERROR');
    return {
      code: 'NETWORK_ERROR',
      message: safeMessage,
      safeMessage,
      severity: 'warning',
    };
  }

  // API errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    if (status === 401) {
      const safeMessage = getSafeMessageForCode('UNAUTHORIZED');
      return {
        code: 'UNAUTHORIZED',
        message: safeMessage,
        safeMessage,
        severity: 'error',
      };
    }
    if (status === 403) {
      const safeMessage = getSafeMessageForCode('FORBIDDEN');
      return {
        code: 'FORBIDDEN',
        message: safeMessage,
        safeMessage,
        severity: 'error',
      };
    }
    if (status >= 500) {
      const safeMessage = getSafeMessageForCode('SERVER_ERROR');
      return {
        code: 'SERVER_ERROR',
        message: safeMessage,
        safeMessage,
        severity: 'error',
      };
    }
  }

  const code = error.code || 'UNKNOWN_ERROR';
  const safeMessage = getSafeMessageForCode(code);
  const rawMessage =
    typeof error.message === 'string' && error.message.trim()
      ? error.message.trim()
      : safeMessage;

  // Default
  return {
    code,
    message: rawMessage,
    safeMessage,
    severity: error.severity || 'error',
  };
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

