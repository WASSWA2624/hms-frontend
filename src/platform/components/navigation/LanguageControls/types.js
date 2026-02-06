/**
 * LanguageControls Types
 * File: types.js
 */
const LOCALE_LABEL_KEYS = {
  en: 'settings.language.options.en',
};

/** ISO 3166-1 alpha-2 country code for flag image (flagcdn.com) */
const LOCALE_FLAG_CODES = {
  en: 'us',
  zh: 'cn',
  hi: 'in',
  es: 'es',
  fr: 'fr',
  ar: 'sa',
  sw: 'ke',
};

/** Fallback Unicode flag emoji for native / unsupported contexts */
const LOCALE_FLAGS = {
  en: '🇺🇸',
  zh: '🇨🇳',
  hi: '🇮🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  ar: '🇸🇦',
  sw: '🇰🇪',
};

const LOCALE_VALUES = Object.keys(LOCALE_LABEL_KEYS);
const LOCALE_STORAGE_KEY = 'user_locale';

const FLAG_CDN_BASE = 'https://flagcdn.com';

export { LOCALE_LABEL_KEYS, LOCALE_FLAGS, LOCALE_FLAG_CODES, LOCALE_VALUES, LOCALE_STORAGE_KEY, FLAG_CDN_BASE };
