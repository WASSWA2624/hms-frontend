/**
 * API Interceptors
 * Handles auth headers and token refresh
 * File: interceptors.js
 */
import { tokenManager } from '@security';
import { handleError } from '@errors';
import { endpoints } from '@config/endpoints';
import { clearCsrfToken } from '@services/csrf';

let inFlightRefreshPromise = null;

const unwrapPayload = (payload) => payload?.data?.data ?? payload?.data ?? payload;

const extractTokenPair = (payload) => {
  const source = unwrapPayload(payload) || {};
  const tokenSource = source.tokens && typeof source.tokens === 'object' ? source.tokens : source;
  const accessToken = tokenSource.access_token || tokenSource.accessToken || null;
  const refreshToken = tokenSource.refresh_token || tokenSource.refreshToken || null;
  return { accessToken, refreshToken };
};

const requestTokenRefresh = async () => {
  const refreshToken = await tokenManager.getRefreshToken();
  if (!refreshToken) return false;

  let response;
  try {
    response = await fetch(endpoints.AUTH.REFRESH, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    return false;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
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

