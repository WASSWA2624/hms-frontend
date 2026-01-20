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
export const API_BASE_URL = getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'http://localhost:3000');
export const API_VERSION = getEnvVar('EXPO_PUBLIC_API_VERSION', 'v1');

