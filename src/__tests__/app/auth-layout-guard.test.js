/**
 * Auth Layout Guard Tests (Step 7.14)
 *
 * Tests for auth layout with auth guard integration:
 * - Unauthenticated users can access auth routes (no redirect)
 * - Authenticated users are redirected to home route when accessing auth routes
 * - All branches (authenticated vs unauthenticated states)
 * - Integration between layout and guard hook
 *
 * Per testing.mdc: 100% coverage required (critical path: auth/access control)
 */

import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@store/rootReducer';
import AuthLayout from '@app/(auth)/_layout';
import { useAuthGuard } from '@navigation/guards';
import { usePathname, useRouter } from 'expo-router';

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
}));

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: mockReplace,
    push: mockPush,
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  })),
  usePathname: jest.fn(() => '/login'),
  useSegments: jest.fn(() => []),
  useLocalSearchParams: jest.fn(() => ({})),
  useGlobalSearchParams: jest.fn(() => ({})),
  Slot: ({ children }) => children || null,
}));

const createMockStore = (overrides = {}) => {
  const base = {
    ui: {
      theme: 'light',
      locale: 'en',
      isLoading: false,
      isAuthenticated: false,
      user: null,
    },
    network: { isOnline: true },
    auth: { isAuthenticated: false, user: null, isLoading: false, errorCode: null },
  };
  return configureStore({
    reducer: rootReducer,
    preloadedState: { ...base, ...overrides },
  });
};

const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <AuthLayout />
    </Provider>
  );

describe('AuthLayout with Auth Guard (Step 7.14)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePathname.mockReturnValue('/login');
  });

  it('should not redirect when unauthenticated', async () => {
    useAuthGuard.mockReturnValue({ authenticated: false, user: null });
    const store = createMockStore();

    renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('should redirect authenticated users to home route', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
    const store = createMockStore({
      auth: { isAuthenticated: true, user: { id: '1', email: 'test@example.com' }, isLoading: false, errorCode: null },
    });

    renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });
  });

  it('should allow register route for authorized roles', async () => {
    usePathname.mockReturnValue('/register');
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com', roles: ['admin'] },
    });
    const store = createMockStore({
      auth: {
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', roles: ['admin'] },
        isLoading: false,
        errorCode: null,
      },
    });

    renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('should redirect from register route when user lacks access', async () => {
    usePathname.mockReturnValue('/register');
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
    const store = createMockStore({
      auth: { isAuthenticated: true, user: { id: '1', email: 'test@example.com' }, isLoading: false, errorCode: null },
    });

    renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });
  });

  it('should redirect only once when authenticated (idempotent)', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
    const store = createMockStore({
      auth: { isAuthenticated: true, user: { id: '1', email: 'test@example.com' }, isLoading: false, errorCode: null },
    });

    const { rerender } = renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });

    rerender(
      <Provider store={store}>
        <AuthLayout />
      </Provider>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle transition from unauthenticated to authenticated', async () => {
    let authenticated = false;
    useAuthGuard.mockImplementation(() => ({
      authenticated,
      user: authenticated ? { id: '1', email: 'test@example.com' } : null,
    }));
    const store = createMockStore();

    const { rerender } = renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });

    authenticated = true;
    mockReplace.mockClear();
    rerender(
      <Provider store={store}>
        <AuthLayout />
      </Provider>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });
  });

  it('should handle transition from authenticated to unauthenticated', async () => {
    let authenticated = true;
    useAuthGuard.mockImplementation(() => ({
      authenticated,
      user: authenticated ? { id: '1', email: 'test@example.com' } : null,
    }));
    const store = createMockStore({
      auth: { isAuthenticated: true, user: { id: '1' }, isLoading: false, errorCode: null },
    });

    const { rerender } = renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });

    authenticated = false;
    mockReplace.mockClear();
    rerender(
      <Provider store={store}>
        <AuthLayout />
      </Provider>
    );

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('should reset redirect flag when transitioning to unauthenticated then back', async () => {
    let authenticated = true;
    useAuthGuard.mockImplementation(() => ({
      authenticated,
      user: authenticated ? { id: '1', email: 'test@example.com' } : null,
    }));
    const store = createMockStore({
      auth: { isAuthenticated: true, user: { id: '1' }, isLoading: false, errorCode: null },
    });

    const { rerender } = renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });

    authenticated = false;
    mockReplace.mockClear();
    rerender(
      <Provider store={store}>
        <AuthLayout />
      </Provider>
    );
    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });

    authenticated = true;
    rerender(
      <Provider store={store}>
        <AuthLayout />
      </Provider>
    );
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });
  });

  it('should call useAuthGuard with skipRedirect: true', () => {
    useAuthGuard.mockReturnValue({ authenticated: false, user: null });
    const store = createMockStore();

    renderWithStore(store);

    expect(useAuthGuard).toHaveBeenCalledWith({ skipRedirect: true });
  });

  it('should handle useAuthGuard returning undefined authenticated', async () => {
    useAuthGuard.mockReturnValue({ authenticated: undefined, user: null });
    const store = createMockStore();

    renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('should redirect when authenticated even if user is null', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: null,
    });
    const store = createMockStore({
      auth: { isAuthenticated: true, user: null, isLoading: false, errorCode: null },
    });

    renderWithStore(store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });
  });
});
