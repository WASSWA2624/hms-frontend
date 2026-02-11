/**
 * Role Guard Hook Tests
 * 
 * Tests for useRoleGuard hook covering:
 * - Hook returned API (hasAccess, error code)
 * - State transitions (hasAccess true → false, false → true)
 * - Side effects (redirect behavior)
 * - Error handling (network errors, selector errors)
 * - All branches (has required role vs lacks role, single role vs multiple roles, with/without redirect path)
 * - Edge cases (empty roles array, invalid roles, null user)
 * 
 * Coverage: 100% required (critical path: auth/access control)
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { useRoleGuard, ROLE_GUARD_ERRORS } from '@navigation/guards/role.guard';
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
const TestComponent = ({ options, onResult }) => {
  const api = useRoleGuard(options);
  
  React.useEffect(() => {
    onResult(api);
  }, [api, onResult]);
  
  return null;
};

describe('useRoleGuard', () => {
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

    // Setup default mock state
    // Note: Auth state is in UI slice for Phase 0-7 (will move to auth feature in Phase 9)
    mockState = {
      _persist: { rehydrated: true },
      ui: {
        theme: 'light',
        locale: 'en',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      },
      network: {
        isOnline: true,
        isSyncing: false,
      },
    };

    // Mock useSelector to use mock state
    // Automatically sync isAuthenticated with user presence
    useSelector.mockImplementation((selector) => {
      // Auto-sync isAuthenticated with user
      if (mockState.ui) {
        mockState.ui.isAuthenticated = !!mockState.ui.user;
      }
      return selector(mockState);
    });
  });

  describe('Hook returned API', () => {
    it('should return hasAccess true when user has required single role', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should return hasAccess true when user has one of required multiple roles', async () => {
      mockState.ui.user = { id: '1', role: 'MODERATOR' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <TestComponent
          options={{ requiredRoles: ['ADMIN', 'MODERATOR'] }}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should return hasAccess false when user lacks required role', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      });
    });

    it('should return hasAccess false and NO_USER error when user is null', async () => {
      mockState.ui.user = null;
      mockState.ui.isAuthenticated = false;

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.NO_USER);
      });
    });

    it('should return hasAccess true when no required roles specified', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(<TestComponent options={{}} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should handle user with roles array', async () => {
      mockState.ui.user = { id: '1', roles: ['ADMIN', 'MODERATOR'] };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });
  });

  describe('Redirect behavior', () => {
    it('should redirect to default /dashboard path when access denied', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should redirect to custom redirect path when provided', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      render(
        <TestComponent
          options={{ requiredRoles: 'ADMIN', redirectPath: '/unauthorized' }}
          onResult={() => {}}
        />
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
      });
    });

    it('should not redirect when access granted', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN' };

      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should not redirect when no required roles specified', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      render(<TestComponent options={{}} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should only redirect once per access denied state (idempotent)', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      const { rerender } = render(
        <TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={() => {}} />
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      });

      // Rerender should not trigger another redirect
      rerender(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('State transitions', () => {
    it('should handle transition from access denied to access granted', async () => {
      let currentUser = { id: '1', role: 'USER' };

      useSelector.mockImplementation((selector) => {
        const state = {
          _persist: { rehydrated: true },
          ui: {
            theme: 'light',
            locale: 'en',
            isLoading: false,
            isAuthenticated: !!currentUser,
            user: currentUser,
          },
          network: {
            isOnline: true,
            isSyncing: false,
          },
        };
        return selector(state);
      });

      let api;
      const { rerender } = render(
        <TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });

      // Transition to access granted
      currentUser = { id: '1', role: 'ADMIN' };
      mockRouter.replace.mockClear();

      rerender(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should handle transition from access granted to access denied', async () => {
      let currentUser = { id: '1', role: 'ADMIN' };

      useSelector.mockImplementation((selector) => {
        const state = {
          _persist: { rehydrated: true },
          ui: {
            theme: 'light',
            locale: 'en',
            isLoading: false,
            isAuthenticated: !!currentUser,
            user: currentUser,
          },
          network: {
            isOnline: true,
            isSyncing: false,
          },
        };
        return selector(state);
      });

      let api;
      const { rerender } = render(
        <TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });

      // Transition to access denied
      currentUser = { id: '1', role: 'USER' };

      rerender(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
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
        render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={() => {}} />);
      }).toThrow('Selector error');
    });

    it('should handle router errors gracefully', () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      mockRouter.replace.mockImplementation(() => {
        throw new Error('Router error');
      });

      // Should throw error (router error propagates)
      expect(() => {
        render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={() => {}} />);
      }).toThrow('Router error');
    });

    it('should handle null/undefined selector results', async () => {
      useSelector.mockImplementation(() => undefined);

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        // Should handle gracefully - hook should still return structure
        expect(api).toBeDefined();
        expect(api).toHaveProperty('hasAccess');
        expect(api).toHaveProperty('errorCode');
      });
    });
  });

  describe('Options parameter', () => {
    it('should use default redirect path when no redirectPath provided', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={() => {}} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should use custom redirect path when provided', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      render(
        <TestComponent
          options={{ requiredRoles: 'ADMIN', redirectPath: '/forbidden' }}
          onResult={() => {}}
        />
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/forbidden');
      });
    });

    it('should handle undefined options', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      let api;
      render(<TestComponent options={undefined} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should handle null options', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      let api;
      render(<TestComponent options={null} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty required roles array', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      let api;
      render(<TestComponent options={{ requiredRoles: [] }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should handle user with no role field', async () => {
      mockState.ui.user = { id: '1' };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      });
    });

    it('should handle user with empty roles array', async () => {
      mockState.ui.user = { id: '1', roles: [] };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      });
    });

    it('should handle multiple required roles with user having one matching role', async () => {
      mockState.ui.user = { id: '1', role: 'MODERATOR' };

      let api;
      render(
        <TestComponent
          options={{ requiredRoles: ['ADMIN', 'MODERATOR', 'SUPER_ADMIN'] }}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should handle multiple required roles with user having none matching', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      let api;
      render(
        <TestComponent
          options={{ requiredRoles: ['ADMIN', 'MODERATOR', 'SUPER_ADMIN'] }}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      });
    });

    it('should handle user with roles array containing required role', async () => {
      mockState.ui.user = { id: '1', roles: ['USER', 'ADMIN', 'MODERATOR'] };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should handle user with both role and roles fields', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN', roles: ['USER', 'MODERATOR'] };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        // Should prioritize roles array if present
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      });
    });

    it('should handle case-sensitive role matching', async () => {
      mockState.ui.user = { id: '1', role: 'admin' };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        // Role matching should be case-sensitive
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      });
    });

    it('should handle userRoles as non-array (normalize to array)', async () => {
      // Test the branch where userRoles is not an array (line 59)
      mockState.ui.user = { id: '1', roles: 'ADMIN' }; // string instead of array

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should not redirect when hasRedirected is true (covers line 83 else branch)', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      let api;
      const { rerender } = render(
        <TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      });

      // Rerender with same state (hasRedirected.current should be true now)
      // This tests the branch where !hasRedirected.current is false
      mockRouter.replace.mockClear();
      rerender(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        // Should not redirect again (hasRedirected.current is true)
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should not redirect when hasAccess is false but requiredRolesArray is empty (covers line 83 requiredRolesArray.length branch)', async () => {
      // This tests the branch where hasAccess is false but requiredRolesArray.length === 0
      // This edge case shouldn't normally happen, but we test it for 100% branch coverage
      mockState.ui.user = null; // No user means hasAccess will be false

      let api;
      render(<TestComponent options={{ requiredRoles: [] }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        // Even though user is null (hasAccess would be false), 
        // requiredRolesArray.length === 0 means we don't redirect
        expect(api.hasAccess).toBe(false);
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error codes', () => {
    it('should return NO_USER error code when user is null', async () => {
      mockState.ui.user = null;

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.NO_USER);
      });
    });

    it('should return INSUFFICIENT_ROLE error code when user lacks required role', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      });
    });

    it('should return null error code when access granted', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN' };

      let api;
      render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.errorCode).toBeNull();
      });
    });
  });
});

