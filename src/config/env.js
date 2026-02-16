/**
 * Environment Configuration
 * Centralized environment variable access
 */

const getEnvVar = (key, defaultValue = null) => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === null) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return defaultValue;
  }
  return value;
};

export const NODE_ENV = getEnvVar('NODE_ENV', 'development');

const isLoopbackHost = (hostname) => {
  const normalized = String(hostname || '').toLowerCase();
  return normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1';
};

const replaceWithCurrentWebHostname = (urlValue) => {
  if (typeof window === 'undefined' || !window.location?.hostname) return urlValue;
  try {
    const parsed = new URL(urlValue);
    if (!isLoopbackHost(parsed.hostname)) return urlValue;
    if (isLoopbackHost(window.location.hostname)) return urlValue;
    parsed.hostname = window.location.hostname;
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return urlValue;
  }
};

const resolveApiBaseUrl = () => {
  const raw = getEnvVar('EXPO_PUBLIC_API_BASE_URL', '').trim();
  if (raw) return replaceWithCurrentWebHostname(raw);
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:3000`;
  }
  return 'http://localhost:3000';
};

export const API_BASE_URL = resolveApiBaseUrl();
export const API_VERSION = getEnvVar('EXPO_PUBLIC_API_VERSION', 'v1');
export const APP_VERSION = getEnvVar('EXPO_PUBLIC_APP_VERSION', '0.1.0');
export const BUILD_NUMBER = getEnvVar('EXPO_PUBLIC_BUILD_NUMBER', '0');
export const APP_ENVIRONMENT = getEnvVar('EXPO_PUBLIC_APP_ENVIRONMENT', NODE_ENV);
export const SUPPORT_EMAIL = getEnvVar('EXPO_PUBLIC_SUPPORT_EMAIL', '');
export const SUPPORT_PHONE = getEnvVar('EXPO_PUBLIC_SUPPORT_PHONE', '');

