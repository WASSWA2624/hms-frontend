/**
 * Redux Persist Configuration
 * File: persist.js
 *
 * Uses AsyncStorage directly with raw string pass-through per redux-persist contract.
 * Do NOT use @services/storage here - it JSON.parses/stringifies; redux-persist expects raw strings.
 */
import { createTransform, persistReducer } from 'redux-persist';
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

const sanitizeTheme = (theme) => (theme === 'dark' ? 'dark' : 'light');

const sanitizeLocale = (locale) =>
  typeof locale === 'string' && locale.trim() ? locale : undefined;

/**
 * Persist only stable, non-sensitive UI preferences.
 * Transient UI flags and auth-like metadata are intentionally excluded.
 */
const uiStateTransform = createTransform(
  (inboundState, key) => {
    if (key !== 'ui' || !inboundState || typeof inboundState !== 'object') {
      return inboundState;
    }

    const locale = sanitizeLocale(inboundState.locale);
    const persisted = {
      theme: sanitizeTheme(inboundState.theme),
    };

    if (locale) {
      persisted.locale = locale;
    }

    return persisted;
  },
  (outboundState) => outboundState,
  { whitelist: ['ui'] }
);

const persistConfig = {
  key: 'root',
  storage: persistStorage,
  whitelist: ['ui'],
  transforms: [uiStateTransform],
};

const createPersistedReducer = (reducer) => {
  return persistReducer(persistConfig, reducer);
};

export { uiStateTransform };
export { createPersistedReducer };
export default { createPersistedReducer };
