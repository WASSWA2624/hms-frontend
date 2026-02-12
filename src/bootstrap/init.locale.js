/**
 * Locale Initialization
 * File: init.locale.js
 */
import store from '@store';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import { createI18n, getDeviceLocale, LOCALE_STORAGE_KEY } from '@i18n';
import { logger } from '@logging';

const resolveSupportedLocale = (value, supportedLocales) => {
  if (!value || typeof value !== 'string') return null;
  if (!Array.isArray(supportedLocales) || supportedLocales.length === 0) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (supportedLocales.includes(trimmed)) return trimmed;
  const normalized = trimmed.replace(/_/g, '-');
  if (supportedLocales.includes(normalized)) return normalized;
  const base = normalized.split('-')[0];
  if (supportedLocales.includes(base)) return base;
  return null;
};

export async function initLocale() {
  try {
    const supportedLocales = createI18n().supportedLocales;
    const deviceLocale = resolveSupportedLocale(getDeviceLocale(), supportedLocales) || 'en';
    let locale = deviceLocale;

    try {
      const persistedLocale = await asyncStorage.getItem(LOCALE_STORAGE_KEY);
      const persisted = resolveSupportedLocale(persistedLocale, supportedLocales);
      if (persisted) {
        locale = persisted;
      }
    } catch (error) {
      logger.debug('Could not load persisted locale, using device locale', { error: error.message });
    }

    store.dispatch(actions.setLocale(locale));
    logger.info('Locale initialized successfully', { locale });
  } catch (error) {
    logger.error('Locale initialization failed', { error: error.message });
    // Locale init failure is non-fatal; keep default slice locale.
  }
}
