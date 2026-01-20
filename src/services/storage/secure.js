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

const getItem = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    reportStorageError(error, { op: 'getItem', key });
    return null;
  }
};

const setItem = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'setItem', key });
    return false;
  }
};

const removeItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    reportStorageError(error, { op: 'removeItem', key });
    return false;
  }
};

export { getItem, setItem, removeItem };

