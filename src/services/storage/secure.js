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

// Do not persist secure values in plaintext fallback storage.
// If SecureStore is unavailable, keep values in volatile in-memory storage only.
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
    return getVolatileItem(key);
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    reportStorageError(error, { op: 'getItem', key });
    return getVolatileItem(key);
  }
};

const setItem = async (key, value) => {
  const safeValue = typeof value === 'string' ? value : String(value ?? '');
  const available = await isSecureStoreAvailable();
  if (!available) {
    return setVolatileItem(key, safeValue);
  }

  try {
    await SecureStore.setItemAsync(key, safeValue);
    removeVolatileItem(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setItem', key });
    return setVolatileItem(key, safeValue);
  }
};

const removeItem = async (key) => {
  const available = await isSecureStoreAvailable();
  if (!available) {
    return removeVolatileItem(key);
  }

  try {
    await SecureStore.deleteItemAsync(key);
    removeVolatileItem(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'removeItem', key });
    return removeVolatileItem(key);
  }
};

export { getItem, setItem, removeItem };
