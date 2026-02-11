/**
 * Auth Guard Hook Tests
 * 
 * Tests for useAuthGuard hook covering:
 * - Hook returned API (authenticated state, user data)
 * - State transitions (authenticated → unauthenticated, unauthenticated → authenticated)
 * - Side effects (redirect behavior)
 * - Error handling (network errors, selector errors)
 * - All branches (authenticated vs unauthenticated, with/without redirect path parameter)
 * 
 * Coverage: 100% required (critical path: auth/access control)
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useAuthGuard } from '@navigation/guards/auth.guard';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

// Mock dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Test component to render hook
const TestComponent = ({ options, onResult, onRouterCall }) => {
  const api = useAuthGuard(options);
  const router = useRouter();
  
  React.useEffect(() => {
    onResult(api);
    if (onRouterCall) {
      onRouterCall(router);
    }
  }, [api, router, onResult, onRouterCall]);
  
  return null;
};

describe('useAuthGuard', () => {
  let mockRouter;
  let mockState;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup router mock
    mockRouter = {
      replace: jest.fn(),
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    // Setup default mock state (selectors use state.auth)
    mockState = {
      _persist: { rehydrated: true },
      auth: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        errorCode: null,
      },
      ui: { theme: 'light', locale: 'en', isLoading: false },
      network: { isOnline: true, isSyncing: false },
    };

    // Mock useSelector to use mock state
    useSelector.mockImplementation((selector) => {
      return selector(mockState);
    });
  });

  describe('Hook returned API', () => {
    it('should return authenticated state and user data when authenticated', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockState.auth.isAuthenticated = true;
      mockState.auth.user = mockUser;

      let api;
      render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(true);
        expect(api.user).toEqual(mockUser);
      });
    });

    it('should return unauthenticated state and null user when not authenticated', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      let api;
      render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(api.user).toBeNull();
      });
    });

    it('should return null user when user is undefined', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = undefined;

      let api;
      render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(api.user).toBeNull();
      });
    });
  });

  describe('Redirect behavior', () => {
    it('should redirect to default /dashboard path when unauthenticated', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      render(<TestComponent onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should redirect to custom redirect path when provided', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      render(<TestComponent options={{ redirectPath: '/custom-login' }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/custom-login');
      });
    });

    it('should not redirect when authenticated', async () => {
      mockState.auth.isAuthenticated = true;
      mockState.auth.user = { id: '1', email: 'test@example.com' };

      render(<TestComponent onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should only redirect once per unauthenticated state (idempotent)', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      const { rerender } = render(<TestComponent onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      });

      // Rerender should not trigger another redirect
      rerender(<TestComponent onResult={() => {}} />);
      
      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('State transitions', () => {
    it('should handle transition from unauthenticated to authenticated', async () => {
      let currentAuthState = false;
      let currentUser = null;

      useSelector.mockImplementation((selector) => {
        const state = {
          _persist: { rehydrated: true },
          auth: { isAuthenticated: currentAuthState, user: currentUser, isLoading: false, errorCode: null },
          ui: { theme: 'light', locale: 'en', isLoading: false },
          network: { isOnline: true, isSyncing: false },
        };
        return selector(state);
      });

      let api;
      const { rerender } = render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });

      // Transition to authenticated
      currentAuthState = true;
      currentUser = { id: '1', email: 'test@example.com' };
      mockRouter.replace.mockClear();

      rerender(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(true);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should handle transition from authenticated to unauthenticated', async () => {
      let currentAuthState = true;
      let currentUser = { id: '1', email: 'test@example.com' };

      // Mock useSelector to return current state (selectors use state.auth)
      useSelector.mockImplementation((selector) => {
        const state = {
          _persist: { rehydrated: true },
          auth: { isAuthenticated: currentAuthState, user: currentUser, isLoading: false, errorCode: null },
          ui: { theme: 'light', locale: 'en', isLoading: false },
          network: { isOnline: true, isSyncing: false },
        };
        return selector(state);
      });

      let api;
      const { rerender } = render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(true);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });

      // Transition to unauthenticated
      currentAuthState = false;
      currentUser = null;

      rerender(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should reset redirect flag when transitioning from unauthenticated to authenticated', async () => {
      let currentAuthState = false;
      let currentUser = null;

      // Mock useSelector to return current state (selectors use state.auth)
      useSelector.mockImplementation((selector) => {
        const state = {
          _persist: { rehydrated: true },
          auth: { isAuthenticated: currentAuthState, user: currentUser, isLoading: false, errorCode: null },
          ui: { theme: 'light', locale: 'en', isLoading: false },
          network: { isOnline: true, isSyncing: false },
        };
        return selector(state);
      });

      let api;
      const { rerender } = render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });

      // Transition to authenticated (should reset redirect flag - covers else if branch)
      currentAuthState = true;
      currentUser = { id: '1', email: 'test@example.com' };
      mockRouter.replace.mockClear();

      rerender(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(true);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });

      // Transition back to unauthenticated (should redirect again)
      currentAuthState = false;
      currentUser = null;

      rerender(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should execute else if branch when starting authenticated', async () => {
      // Start authenticated - this should hit the else if branch (isAuthenticated = true)
      mockState.auth.isAuthenticated = true;
      mockState.auth.user = { id: '1', email: 'test@example.com' };

      let api;
      render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(true);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should not execute else if branch when unauthenticated and already redirected', async () => {
      // This tests the else if branch when isAuthenticated is false and hasRedirected.current is true
      // Start unauthenticated, trigger redirect, then change redirectPath to trigger effect again
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      let api;
      const { rerender } = render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      });

      // Change redirectPath to trigger useEffect again (hasRedirected.current should be true now)
      // This tests the branch: isAuthenticated === false && hasRedirected.current === true
      // The else if condition !hasRedirected.current should be false, so redirect block doesn't execute
      mockRouter.replace.mockClear();
      rerender(<TestComponent options={{ redirectPath: '/signin' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        // Should not redirect again because hasRedirected.current is true (idempotent)
        // The redirectPath change triggers the effect, but hasRedirected.current prevents redirect
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle selector errors gracefully', () => {
      useSelector.mockImplementation(() => {
        throw new Error('Selector error');
      });

      // Should throw error (selector error propagates)
      expect(() => {
        render(<TestComponent onResult={() => {}} />);
      }).toThrow('Selector error');
    });

    it('should handle router errors gracefully', () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      mockRouter.replace.mockImplementation(() => {
        throw new Error('Router error');
      });

      // Should throw error (router error propagates)
      expect(() => {
        render(<TestComponent onResult={() => {}} />);
      }).toThrow('Router error');
    });

    it('should handle null/undefined selector results', async () => {
      useSelector.mockImplementation(() => undefined);

      let api;
      render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        // Should handle gracefully - hook should still return structure
        expect(api).toBeDefined();
        expect(api).toHaveProperty('authenticated');
        expect(api).toHaveProperty('user');
      });
    });
  });

  describe('Options parameter', () => {
    it('should use default redirect path when no options provided', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      render(<TestComponent onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should use default redirect path when options is empty object', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      render(<TestComponent options={{}} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should use custom redirect path when provided in options', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      render(<TestComponent options={{ redirectPath: '/signin' }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/signin');
      });
    });

    it('should skip redirect when skipRedirect is true and user is unauthenticated', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      let api;
      render(<TestComponent options={{ skipRedirect: true }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should skip redirect when skipRedirect is true and user is authenticated', async () => {
      mockState.auth.isAuthenticated = true;
      mockState.auth.user = { id: '1', email: 'test@example.com' };

      let api;
      render(<TestComponent options={{ skipRedirect: true }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.authenticated).toBe(true);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should skip redirect when skipRedirect is true even with custom redirectPath', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      let api;
      render(
        <TestComponent
          options={{ skipRedirect: true, redirectPath: '/custom-login' }}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.authenticated).toBe(false);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should not skip redirect when skipRedirect is false', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      render(<TestComponent options={{ skipRedirect: false }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string redirect path', async () => {
      mockState.auth.isAuthenticated = false;
      mockState.auth.user = null;

      render(<TestComponent options={{ redirectPath: '' }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('');
      });
    });

    it('should handle user object with all fields', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['user'],
      };

      mockState.auth.isAuthenticated = true;
      mockState.auth.user = mockUser;

      let api;
      render(<TestComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.user).toEqual(mockUser);
      });
    });
  });
});

