/**
 * useI18n Hook Tests
 * File: useI18n.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useI18n from '@hooks/useI18n';
import rootReducer from '@store/rootReducer';
import * as i18n from '@i18n';

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const TestComponent = ({ onResult }) => {
  const api = useI18n();
  React.useEffect(() => {
    onResult(api);
  });
  return null;
};

describe('useI18n', () => {
  it('returns translator that resolves known keys', async () => {
    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.locale).toBe('en');
      expect(result.t('common.save')).toBe('Save');
      expect(result.tSync('common.save')).toBe('Save');
    });
  });

  it('returns deterministic fallback for missing keys (never throws)', async () => {
    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.t('missing.key.path')).toBe('missing.key.path');
    });
  });

  it('supports interpolation when i18n implementation provides it', async () => {
    const spy = jest.spyOn(i18n, 'createI18n').mockImplementation(() => ({
      tSync: (key, params) =>
        key === 'greeting.hello' ? `Hi ${params?.name || ''}`.trim() : key,
    }));

    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.t('greeting.hello', { name: 'Ada' })).toBe('Hi Ada');
    });

    spy.mockRestore();
  });

  it('falls back to key when translation implementation throws', async () => {
    const spy = jest.spyOn(i18n, 'createI18n').mockImplementation(() => ({
      tSync: () => {
        throw new Error('translation failure');
      },
    }));

    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.t('any.key')).toBe('any.key');
      expect(result.tSync('any.key')).toBe('any.key');
      expect(result.tSync(null)).toBe('');
    });

    spy.mockRestore();
  });

  it('does not log during production translation paths', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.t('common.save')).toBe('Save');
      expect(result.t('missing.key.path')).toBe('missing.key.path');
    });

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

