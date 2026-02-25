/**
 * API Interceptors
 * Handles auth headers and token refresh
 * File: interceptors.js
 */
import { tokenManager } from '@security';
import { handleError } from '@errors';
import { endpoints } from '@config/endpoints';
import { clearCsrfToken, getCsrfHeaders } from '@services/csrf';

let inFlightRefreshPromise = null;
const CSRF_ERROR_MESSAGES = new Set([
  'errors.csrf.missing',
  'errors.csrf.invalid',
]);

const unwrapPayload = (payload) => payload?.data?.data ?? payload?.data ?? payload;

const extractTokenPair = (payload) => {
  const source = unwrapPayload(payload) || {};
  const tokenSource = source.tokens && typeof source.tokens === 'object' ? source.tokens : source;
  const accessToken = tokenSource.access_token || tokenSource.accessToken || null;
  const refreshToken = tokenSource.refresh_token || tokenSource.refreshToken || null;
  return { accessToken, refreshToken };
};

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

const parseErrorPayload = async (response) => {
  const contentType = response?.headers?.get?.('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const requestTokenRefresh = async (csrfRetried = false) => {
  const refreshToken = await tokenManager.getRefreshToken();
  if (!refreshToken) return false;

  let csrfHeaders = {};
  try {
    csrfHeaders = await getCsrfHeaders();
  } catch {
    clearCsrfToken();
    csrfHeaders = {};
  }

  let response;
  try {
    response = await fetch(endpoints.AUTH.REFRESH, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...csrfHeaders,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    return false;
  }

  if (!response.ok) {
    const errorPayload = await parseErrorPayload(response);
    const isStaleCsrf = isCsrfFailure(response.status, errorPayload);

    if (!csrfRetried && isStaleCsrf) {
      clearCsrfToken();
      return requestTokenRefresh(true);
    }

    if (response.status === 401 || (response.status === 403 && !isStaleCsrf)) {
      await tokenManager.clearTokens();
      clearCsrfToken();
    }
    return false;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const nextTokens = extractTokenPair(payload);
  if (!nextTokens.accessToken || !nextTokens.refreshToken) {
    return false;
  }

  let persist = true;
  try {
    persist = await tokenManager.shouldPersistTokens();
  } catch {
    persist = true;
  }

  await tokenManager.setTokens(nextTokens.accessToken, nextTokens.refreshToken, {
    persist,
  });
  return true;
};

const refreshAccessToken = async () => {
  if (!inFlightRefreshPromise) {
    inFlightRefreshPromise = requestTokenRefresh().finally(() => {
      inFlightRefreshPromise = null;
    });
  }
  return inFlightRefreshPromise;
};

const attachAuthHeader = async (config) => {
  const token = await tokenManager.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleAuthError = async (error, options = {}) => {
  const {
    canRetryAuth = false,
    hasRetriedAuth = false,
    retryRequest = null,
  } = options;

  if (
    error?.status === 401 &&
    canRetryAuth &&
    !hasRetriedAuth &&
    typeof retryRequest === 'function'
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return retryRequest();
    }
  }

  throw handleError(error);
};

export { attachAuthHeader, handleAuthError };

