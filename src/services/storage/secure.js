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
// - Web prefers localStorage (persistent), then falls back to sessionStorage.
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

const getWebStorageList = () => {
  try {
    if (typeof window === 'undefined') return [];
    const storages = [];
    if (window.localStorage) {
      storages.push(window.localStorage);
    }
    if (window.sessionStorage && window.sessionStorage !== window.localStorage) {
      storages.push(window.sessionStorage);
    }
    return storages;
  } catch (error) {
    reportStorageError(error, { op: 'webSessionStorage' });
    return [];
  }
};

const getWebSessionItem = (key) => {
  const storages = getWebStorageList();
  for (const storage of storages) {
    try {
      const value = storage.getItem(key);
      if (value != null) return value;
    } catch (error) {
      reportStorageError(error, { op: 'getWebSessionItem', key });
    }
  }
  return null;
};

const setWebSessionItem = (key, value) => {
  const [primaryStorage] = getWebStorageList();
  if (!primaryStorage) return false;
  try {
    primaryStorage.setItem(key, value);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setWebSessionItem', key });
    return false;
  }
};

const removeWebSessionItem = (key) => {
  const storages = getWebStorageList();
  if (storages.length === 0) return false;
  let removed = false;

  for (const storage of storages) {
    try {
      storage.removeItem(key);
      removed = true;
    } catch (error) {
      reportStorageError(error, { op: 'removeWebSessionItem', key });
    }
  }

  return removed;
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
