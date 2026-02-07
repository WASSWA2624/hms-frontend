/**
 * useDatabaseHealth Hook Tests
 * File: useDatabaseHealth.test.js
 */
import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useDatabaseHealth from '@hooks/useDatabaseHealth';
import rootReducer from '@store/rootReducer';

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const TestComponent = ({ onResult }) => {
  const result = useDatabaseHealth();
  React.useEffect(() => {
    onResult(result);
  }, [result, onResult]);
  return null;
};

describe('useDatabaseHealth', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
    if (!global.AbortSignal || typeof global.AbortSignal.timeout !== 'function') {
      global.AbortSignal = { timeout: () => undefined };
    }
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('reports disconnected when offline (and does not fetch)', async () => {
    const store = createMockStore({
      network: { isOnline: false, isSyncing: false, quality: 'unknown' },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isConnected).toBe(false);
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('checks health when online and fetch succeeds', async () => {
    const store = createMockStore({
      network: { isOnline: true, isSyncing: false, quality: 'unknown' },
    });

    let resolveFetch;
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await act(async () => {
      resolveFetch({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ database: 'ok' }),
      });
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(result.isConnected).toBe(true);
    });
  });

  it('reports disconnected when health check fails', async () => {
    const store = createMockStore({
      network: { isOnline: true, isSyncing: false, quality: 'unknown' },
    });

    let rejectFetch;
    global.fetch.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectFetch = reject;
        })
    );

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await act(async () => {
      rejectFetch(new Error('Network failed'));
    });
    await waitFor(() => {
      expect(result.isConnected).toBe(false);
    });
  });

  it('does not crash when fetch is unavailable', async () => {
    const store = createMockStore({
      network: { isOnline: true, isSyncing: false, quality: 'unknown' },
    });

    delete global.fetch;

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isConnected).toBe(true);
    });
  });
});

