/**
 * SecureStore Service
 * Sensitive data storage (tokens, credentials)
 * File: secure.js
 */
import * as SecureStore from 'expo-secure-store';
import { handleError } from '@errors';

const reportStorageError = (error, context) => {
  handleError(error, {
    scope: 'services.storage.secure',
    ...context,
  });
};

// If SecureStore is unavailable:
// - Web uses sessionStorage so values survive refreshes within the same tab.
// - Native falls back to volatile in-memory storage only.
const volatileStore = new Map();

const getVolatileItem = (key) => {
  return volatileStore.has(key) ? volatileStore.get(key) : null;
};

const setVolatileItem = (key, value) => {
  volatileStore.set(key, value);
  return true;
};

const removeVolatileItem = (key) => {
  volatileStore.delete(key);
  return true;
};

const getWebSessionStorage = () => {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    return window.sessionStorage;
  } catch (error) {
    reportStorageError(error, { op: 'webSessionStorage' });
    return null;
  }
};

const getWebSessionItem = (key) => {
  const webStorage = getWebSessionStorage();
  if (!webStorage) return null;
  try {
    const value = webStorage.getItem(key);
    return value == null ? null : value;
  } catch (error) {
    reportStorageError(error, { op: 'getWebSessionItem', key });
    return null;
  }
};

const setWebSessionItem = (key, value) => {
  const webStorage = getWebSessionStorage();
  if (!webStorage) return false;
  try {
    webStorage.setItem(key, value);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setWebSessionItem', key });
    return false;
  }
};

const removeWebSessionItem = (key) => {
  const webStorage = getWebSessionStorage();
  if (!webStorage) return false;
  try {
    webStorage.removeItem(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'removeWebSessionItem', key });
    return false;
  }
};

const isSecureStoreAvailable = async () => {
  try {
    return await SecureStore.isAvailableAsync();
  } catch (error) {
    reportStorageError(error, { op: 'availability' });
    return false;
  }
};

const getItem = async (key) => {
  const volatileValue = getVolatileItem(key);
  if (volatileValue !== null) {
    return volatileValue;
  }

  const available = await isSecureStoreAvailable();
  if (!available) {
    const webValue = getWebSessionItem(key);
    if (webValue !== null) return webValue;
    return getVolatileItem(key);
  }

  try {
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue !== null) return secureValue;
    const webValue = getWebSessionItem(key);
    if (webValue !== null) return webValue;
    return getVolatileItem(key);
  } catch (error) {
    reportStorageError(error, { op: 'getItem', key });
    const webValue = getWebSessionItem(key);
    if (webValue !== null) return webValue;
    return getVolatileItem(key);
  }
};

const setItem = async (key, value) => {
  const safeValue = typeof value === 'string' ? value : String(value ?? '');
  const available = await isSecureStoreAvailable();
  if (!available) {
    if (setWebSessionItem(key, safeValue)) {
      removeVolatileItem(key);
      return true;
    }
    return setVolatileItem(key, safeValue);
  }

  try {
    await SecureStore.setItemAsync(key, safeValue);
    removeWebSessionItem(key);
    removeVolatileItem(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setItem', key });
    if (setWebSessionItem(key, safeValue)) {
      removeVolatileItem(key);
      return true;
    }
    return setVolatileItem(key, safeValue);
  }
};

const removeItem = async (key) => {
  const available = await isSecureStoreAvailable();
  if (!available) {
    removeWebSessionItem(key);
    return removeVolatileItem(key);
  }

  try {
    await SecureStore.deleteItemAsync(key);
    removeWebSessionItem(key);
    removeVolatileItem(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'removeItem', key });
    removeWebSessionItem(key);
    return removeVolatileItem(key);
  }
};

export { getItem, setItem, removeItem };
