/**
 * API Client
 * Centralized fetch wrapper
 * File: client.js
 */
import { TIMEOUTS } from '@config';
import { handleError } from '@errors';
import { getDeviceLocale, LOCALE_STORAGE_KEY } from '@i18n';
import { async as asyncStorage } from '@services/storage';
import { getCsrfHeaders, clearCsrfToken } from '@services/csrf';
import { attachAuthHeader, handleAuthError } from './interceptors';

const resolveTimeZone = () => {
  try {
    return Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || '';
  } catch {
    return '';
  }
};

const resolvePlatform = () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      if (/android/i.test(navigator.userAgent)) return 'android';
      if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return 'ios';
      return 'web';
    }
  } catch {
    // Ignore runtime platform detection errors.
  }
  return 'unknown';
};

const canAttachCustomContextHeaders = (url) => {
  // Native runtimes are not subject to browser CORS preflight restrictions.
  if (typeof window === 'undefined') return true;

  try {
    const requestUrl = new URL(url, window.location.origin);
    return requestUrl.origin === window.location.origin;
  } catch {
    return false;
  }
};

const resolveRequestLocale = async () => {
  try {
    const storedLocale = await asyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (typeof storedLocale === 'string') {
      const value = storedLocale.trim();
      if (value) return value;
    }
    return getDeviceLocale();
  } catch {
    return getDeviceLocale();
  }
};

const isBackendEnvelope = (value) => {
  if (!value || typeof value !== 'object') return false;
  return (
    typeof value.status === 'number' &&
    typeof value.message === 'string' &&
    Object.prototype.hasOwnProperty.call(value, 'data')
  );
};

const normalizeApiPayload = (payload) => {
  if (isBackendEnvelope(payload)) {
    return {
      data: payload.data,
      meta: payload.meta,
      message: payload.message,
      pagination: payload.pagination,
      raw: payload,
    };
  }
  return { data: payload, raw: payload };
};

const MUTATION_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);
const CSRF_ERROR_MESSAGES = new Set([
  'errors.csrf.missing',
  'errors.csrf.invalid',
]);

const isCsrfFailure = (status, errorData) => {
  if (status !== 403) return false;
  const candidates = [
    errorData?.message,
    errorData?.messageKey,
    errorData?.code,
    errorData?.error,
  ]
    .map((value) =>
      String(value || '')
        .trim()
        .toLowerCase()
    )
    .filter(Boolean);
  return candidates.some((value) => CSRF_ERROR_MESSAGES.has(value));
};

const apiClient = async (config) => {
  const {
    url,
    method = 'GET',
    body,
    headers = {},
    timeout = TIMEOUTS.API_REQUEST,
  } = config;
  const normalizedMethod = String(method || 'GET').toUpperCase();

  const execute = async (csrfRetried = false) => {
    // Attach auth header
    const authConfig = await attachAuthHeader({
      url,
      method: normalizedMethod,
      body,
      headers,
    });
    const requestMethod = String(
      authConfig.method || normalizedMethod
    ).toUpperCase();
    const isMutationRequest = MUTATION_METHODS.has(requestMethod);

    // Get CSRF headers for state-changing requests
    let csrfHeaders = {};
    if (isMutationRequest) {
      try {
        csrfHeaders = await getCsrfHeaders();
      } catch (_csrfError) {
        // Continue without CSRF headers; token may be stale/unavailable.
        clearCsrfToken();
        csrfHeaders = {};
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const locale = await resolveRequestLocale();
      const timezone = resolveTimeZone();
      const platform = resolvePlatform();
      const attachCustomHeaders = canAttachCustomContextHeaders(authConfig.url);
      const response = await fetch(authConfig.url, {
        method: requestMethod,
        credentials: 'include', // Include cookies for session
        headers: {
          'Content-Type': 'application/json',
          ...(locale ? { 'Accept-Language': locale } : {}),
          ...(attachCustomHeaders && locale ? { 'x-locale': locale } : {}),
          ...(attachCustomHeaders && timezone
            ? { 'x-timezone': timezone }
            : {}),
          ...(attachCustomHeaders && platform
            ? { 'x-platform': platform }
            : {}),
          ...authConfig.headers,
          ...csrfHeaders,
        },
        body: authConfig.body ? JSON.stringify(authConfig.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers?.get?.('content-type') || '';
      const hasJson = contentType.includes('application/json');

      if (!response.ok) {
        // Parse error response body
        let errorData = null;
        if (hasJson) {
          try {
            errorData = await response.json();
          } catch (_parseError) {
            // If JSON parsing fails, continue with null
          }
        }

        if (
          !csrfRetried &&
          isMutationRequest &&
          isCsrfFailure(response.status, errorData)
        ) {
          clearCsrfToken();
          return execute(true);
        }

        const error = {
          status: response.status,
          statusText: response.statusText,
          code: errorData?.code || null,
          message:
            errorData?.message || `API request failed: ${response.statusText}`,
          errors: errorData?.errors || [],
        };
        throw await handleAuthError(error);
      }

      const payload = hasJson ? await response.json() : null;
      const normalized = normalizeApiPayload(payload);
      return { ...normalized, status: response.status };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw handleError(new Error('Request timeout'), { url });
      }
      throw await handleAuthError(error);
    }
  };

  return execute(false);
};

export { apiClient };
