/**
 * Locale Initialization Tests
 * File: init.locale.test.js
 */
import { initLocale } from '@bootstrap/init.locale';
import store from '@store';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import { createI18n, getDeviceLocale, LOCALE_STORAGE_KEY } from '@i18n';
import { logger } from '@logging';

jest.mock('@store', () => ({
  dispatch: jest.fn(),
}));

jest.mock('@store/slices/ui.slice', () => ({
  actions: {
    setLocale: jest.fn((locale) => ({ type: 'ui/setLocale', payload: locale })),
  },
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
  },
}));

jest.mock('@i18n', () => ({
  createI18n: jest.fn(),
  getDeviceLocale: jest.fn(),
  LOCALE_STORAGE_KEY: 'user_locale',
}));

jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Locale Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createI18n.mockReturnValue({ supportedLocales: ['en', 'en-US'] });
    getDeviceLocale.mockReturnValue('en-US');
  });

  it('initializes with persisted locale when available', async () => {
    asyncStorage.getItem.mockResolvedValue('en-US');

    await initLocale();

    expect(asyncStorage.getItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY);
    expect(store.dispatch).toHaveBeenCalledWith(actions.setLocale('en-US'));
    expect(logger.info).toHaveBeenCalledWith('Locale initialized successfully', { locale: 'en-US' });
  });

  it('normalizes persisted locale and resolves supported fallback', async () => {
    asyncStorage.getItem.mockResolvedValue('en-gb');

    await initLocale();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setLocale('en'));
  });

  it('falls back to device locale when no persisted locale exists', async () => {
    asyncStorage.getItem.mockResolvedValue(null);

    await initLocale();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setLocale('en-US'));
    expect(logger.info).toHaveBeenCalledWith('Locale initialized successfully', { locale: 'en-US' });
  });

  it('falls back to en when device locale is unsupported', async () => {
    getDeviceLocale.mockReturnValue('fr-FR');
    asyncStorage.getItem.mockResolvedValue(null);

    await initLocale();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setLocale('en'));
  });

  it('handles storage read errors gracefully', async () => {
    asyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

    await expect(initLocale()).resolves.not.toThrow();

    expect(logger.debug).toHaveBeenCalledWith('Could not load persisted locale, using device locale', {
      error: 'Storage error',
    });
    expect(store.dispatch).toHaveBeenCalledWith(actions.setLocale('en-US'));
  });

  it('handles initialization errors gracefully without throwing', async () => {
    createI18n.mockImplementation(() => {
      throw new Error('i18n init error');
    });

    await expect(initLocale()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalledWith('Locale initialization failed', {
      error: 'i18n init error',
    });
  });
});
