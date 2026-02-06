/**
 * Redux Persist Configuration
 * File: persist.js
 *
 * Uses AsyncStorage directly with raw string pass-through per redux-persist contract.
 * Do NOT use @services/storage here - it JSON.parses/stringifies; redux-persist expects raw strings.
 */
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const persistStorage =
  Platform.OS === 'web'
    ? {
        getItem: async (key) =>
          typeof window !== 'undefined' && window.localStorage
            ? window.localStorage.getItem(key)
            : null,
        setItem: async (key, value) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
          }
        },
        removeItem: async (key) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(key);
          }
        },
      }
    : {
        getItem: (key) => AsyncStorage.getItem(key),
        setItem: (key, value) => AsyncStorage.setItem(key, value),
        removeItem: (key) => AsyncStorage.removeItem(key),
      };

const persistConfig = {
  key: 'root',
  storage: persistStorage,
  whitelist: ['ui'],
};

const createPersistedReducer = (reducer) => {
  return persistReducer(persistConfig, reducer);
};

export { createPersistedReducer };
export default { createPersistedReducer };

