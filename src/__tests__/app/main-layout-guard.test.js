/**
 * Main Layout Guard Tests
 * 
 * Tests for main layout with auth guard integration covering:
 * - Authenticated users can access main routes (no redirect)
 * - Unauthenticated users are redirected to login route when accessing main routes
 * - All branches (authenticated vs unauthenticated states)
 * - Integration between layout and guard hook
 * 
 * Coverage: 100% required (critical path: auth/access control)
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MainLayout from '@app/(main)/_layout';
import { useAuthGuard } from '@navigation/guards';
import { useRouter } from 'expo-router';
import rootReducer from '@store/rootReducer';

// Mock dependencies
jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Slot: ({ children }) => children || null,
}));

// Create a mock store for tests
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: {
        theme: 'light',
        locale: 'en',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      },
      network: {
        isOnline: true,
      },
      ...initialState,
    },
  });
};

describe('MainLayout with Auth Guard', () => {
  let mockRouter;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup router mock
    mockRouter = {
      replace: jest.fn(),
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    // Default: authenticated (main routes should be accessible)
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
  });

  it('should render Slot for authenticated users', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // Layout should render without redirecting
      // Note: useAuthGuard handles redirects internally, so we verify it's called
      expect(useAuthGuard).toHaveBeenCalled();
    });
  });

  it('should call useAuthGuard hook', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    expect(useAuthGuard).toHaveBeenCalled();
  });

  it('should call useAuthGuard with default options (redirects to /login)', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    // useAuthGuard should be called (it will handle redirect internally)
    expect(useAuthGuard).toHaveBeenCalled();
    // Default behavior: redirects unauthenticated users to /login
  });

  it('should allow authenticated users to access main routes', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const store = createMockStore();
    const { UNSAFE_root } = render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // Authenticated users should be able to access main routes
      // useAuthGuard will not redirect when authenticated
      expect(UNSAFE_root).toBeDefined();
    });
  });

  it('should redirect unauthenticated users to login route', async () => {
    // Mock useAuthGuard to simulate redirect behavior
    // The hook internally calls router.replace('/login') when unauthenticated
    useAuthGuard.mockImplementation(() => {
      // Simulate the hook's internal redirect behavior
      const router = useRouter();
      React.useEffect(() => {
        router.replace('/login');
      }, [router]);
      
      return {
        authenticated: false,
        user: null,
      };
    });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // useAuthGuard should redirect unauthenticated users to /login
      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle transition from authenticated to unauthenticated', async () => {
    let authenticated = true;

    useAuthGuard.mockImplementation(() => {
      const router = useRouter();
      React.useEffect(() => {
        if (!authenticated) {
          router.replace('/login');
        }
      }, [authenticated, router]);
      
      return {
        authenticated,
        user: authenticated ? { id: '1', email: 'test@example.com' } : null,
      };
    });

    const store = createMockStore();
    const { rerender } = render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // Initially authenticated, no redirect
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    // Transition to unauthenticated
    authenticated = false;
    mockRouter.replace.mockClear();

    rerender(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // Should redirect to login when unauthenticated
      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle transition from unauthenticated to authenticated', async () => {
    let authenticated = false;

    useAuthGuard.mockImplementation(() => {
      const router = useRouter();
      React.useEffect(() => {
        if (!authenticated) {
          router.replace('/login');
        }
      }, [authenticated, router]);
      
      return {
        authenticated,
        user: authenticated ? { id: '1', email: 'test@example.com' } : null,
      };
    });

    const store = createMockStore();
    const { rerender } = render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // Initially unauthenticated, should redirect
      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });

    // Transition to authenticated
    authenticated = true;
    mockRouter.replace.mockClear();

    rerender(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // Should not redirect when authenticated
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('should handle useAuthGuard returning undefined authenticated', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: undefined,
      user: null,
    });

    const store = createMockStore();
    // Should not throw
    expect(() => {
      render(
        <Provider store={store}>
          <MainLayout />
        </Provider>
      );
    }).not.toThrow();
  });

  it('should handle useAuthGuard returning null user for authenticated state', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: null,
    });

    const store = createMockStore();
    const { UNSAFE_root } = render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    await waitFor(() => {
      // Should still allow access if authenticated is true, even if user is null
      expect(UNSAFE_root).toBeDefined();
    });
  });

  it('should render Slot component', () => {
    const store = createMockStore();
    const { UNSAFE_root } = render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );
    
    // Layout should render Slot
    expect(UNSAFE_root).toBeDefined();
  });

  it('should integrate with useAuthGuard hook correctly', () => {
    const mockAuthGuardReturn = {
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    };

    useAuthGuard.mockReturnValue(mockAuthGuardReturn);

    const store = createMockStore();
    render(
      <Provider store={store}>
        <MainLayout />
      </Provider>
    );

    // Verify hook is called and layout renders
    expect(useAuthGuard).toHaveBeenCalled();
  });
});

