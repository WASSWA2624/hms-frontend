/**
 * Main Layout Tests
 * File: main-layout.test.js
 *
 * Tests for src/app/(main)/_layout.jsx (Step 7.10)
 *
 * Per testing.mdc:
 * - Test that layout renders without errors
 * - Test that child routes are rendered via `<Slot />` (mock child routes)
 * - Mock expo-router exports as needed
 * - Test all branches
 *
 * Per app-router.mdc: layouts use _layout.jsx, default export, Slot for child routes.
 * Per Step 7.10: Main group layout exists and renders routes.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@store/rootReducer';

const SLOT_TEST_ID = 'expo-router-slot';

jest.mock('expo-router', () => ({
  Slot: function MockSlot({ children }) {
    return require('react').createElement(
      require('react-native').View,
      { testID: 'expo-router-slot' },
      children ?? null
    );
  },
  useRouter: jest.fn(() => ({ replace: jest.fn(), push: jest.fn() })),
}));

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(() => ({ authenticated: true, user: { id: '1', email: 'test@example.com' } })),
  useRouteAccessGuard: jest.fn(() => ({ hasAccess: true, isPending: false, errorCode: null })),
}));

jest.mock('@hooks', () => ({
  useSessionRestore: jest.fn(() => ({ isReady: true })),
}));

jest.mock('@platform/layouts', () => {
  const React = require('react');
  const { Slot } = require('expo-router');
  const MainRouteLayout = function MockMainRouteLayout() {
    return React.createElement(Slot);
  };
  return { MainRouteLayout };
});

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      network: { isOnline: true },
      ...initialState,
    },
  });

describe('app/(main)/_layout.jsx', () => {
  let AppMainLayout;

  beforeAll(() => {
    AppMainLayout = require('@app/(main)/_layout').default;
  });

  test('has default export', () => {
    expect(AppMainLayout).toBeDefined();
    expect(typeof AppMainLayout).toBe('function');
  });

  test('renders without errors', () => {
    const store = createMockStore();
    expect(() => {
      render(
        <Provider store={store}>
          <AppMainLayout />
        </Provider>
      );
    }).not.toThrow();
  });

  test('renders child routes via Slot (per app-router.mdc)', () => {
    const store = createMockStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <AppMainLayout />
      </Provider>
    );
    expect(getByTestId(SLOT_TEST_ID)).toBeTruthy();
  });

  test('layout is usable as group layout wrapper', () => {
    const store = createMockStore();
    const { UNSAFE_root } = render(
      <Provider store={store}>
        <AppMainLayout />
      </Provider>
    );
    expect(UNSAFE_root).toBeDefined();
  });
});
