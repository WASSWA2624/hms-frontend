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

const isWebStorageAvailable = () => {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const key = '__hms_storage_test__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'webStorageAvailability' });
    return false;
  }
};

const getWebItem = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    reportStorageError(error, { op: 'webGetItem', key });
    return null;
  }
};

const setWebItem = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'webSetItem', key });
    return false;
  }
};

const removeWebItem = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'webRemoveItem', key });
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
  const available = await isSecureStoreAvailable();
  if (!available) {
    if (isWebStorageAvailable()) return getWebItem(key);
    return null;
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    reportStorageError(error, { op: 'getItem', key });
    if (isWebStorageAvailable()) return getWebItem(key);
    return null;
  }
};

const setItem = async (key, value) => {
  const available = await isSecureStoreAvailable();
  if (!available) {
    if (isWebStorageAvailable()) return setWebItem(key, value);
    return false;
  }

  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setItem', key });
    if (isWebStorageAvailable()) return setWebItem(key, value);
    return false;
  }
};

const removeItem = async (key) => {
  const available = await isSecureStoreAvailable();
  if (!available) {
    if (isWebStorageAvailable()) return removeWebItem(key);
    return false;
  }

  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'removeItem', key });
    if (isWebStorageAvailable()) return removeWebItem(key);
    return false;
  }
};

export { getItem, setItem, removeItem };

