/**
 * Navigation Guards Integration Tests
 * 
 * Tests for guard hooks integration and composition covering:
 * - Role guards work correctly in route contexts (integration test)
 * - Multiple guards can be combined without conflicts (composition test)
 * - All branches (different role combinations, with/without redirect path)
 * 
 * Coverage: 100% required (critical path: auth/access control)
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useRoleGuard, useAuthGuard } from '@navigation/guards';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

// Mock dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Slot: ({ children }) => children || null,
}));

// Mock store selectors
jest.mock('@store/selectors', () => ({
  selectUser: jest.fn((state) => state.ui?.user),
  selectIsAuthenticated: jest.fn((state) => state.ui?.isAuthenticated),
}));

// Test component that uses role guard
const RoleGuardedComponent = ({ requiredRoles, redirectPath, onResult }) => {
  const api = useRoleGuard({ requiredRoles, redirectPath });

  React.useEffect(() => {
    onResult(api);
  }, [api, onResult]);

  return null;
};

// Test component that uses both auth and role guards (composition test)
const ComposedGuardsComponent = ({ requiredRoles, redirectPath, onResult }) => {
  const authApi = useAuthGuard({ skipRedirect: true });
  const roleApi = useRoleGuard({ requiredRoles, redirectPath });

  React.useEffect(() => {
    onResult({ auth: authApi, role: roleApi });
  }, [authApi, roleApi, onResult]);

  return null;
};

describe('Navigation Guards Integration', () => {
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

    // Setup default mock state (Phase 0-7: auth state in UI slice)
    mockState = {
      ui: {
        user: null,
        isAuthenticated: false,
      },
    };

    // Mock useSelector to use mock state
    useSelector.mockImplementation((selector) => {
      return selector(mockState);
    });
  });

  describe('Role Guard Integration', () => {
    it('should work correctly in route context with single role requirement', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles="ADMIN"
          redirectPath="/unauthorized"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should redirect when role requirement not met in route context', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles="ADMIN"
          redirectPath="/unauthorized"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBeDefined();
        expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
      });
    });

    it('should work correctly with multiple role requirements', async () => {
      mockState.ui.user = { id: '1', role: 'MODERATOR' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles={['ADMIN', 'MODERATOR']}
          redirectPath="/unauthorized"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });
  });

  describe('Different Role Combinations', () => {
    it('should handle single role requirement', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent requiredRoles="ADMIN" onResult={(v) => (api = v)} />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
      });
    });

    it('should handle multiple role requirements (OR logic)', async () => {
      mockState.ui.user = { id: '1', role: 'MODERATOR' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles={['ADMIN', 'MODERATOR', 'SUPER_ADMIN']}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
      });
    });

    it('should deny access when user has none of the required roles', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles={['ADMIN', 'MODERATOR']}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
      });
    });

    it('should use default redirect path when redirectPath not provided', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles="ADMIN"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/home');
      });
    });

    it('should use custom redirect path when provided', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles="ADMIN"
          redirectPath="/custom-unauthorized"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/custom-unauthorized');
      });
    });

    it('should grant access when requiredRoles is null (empty array branch)', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles={null}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should grant access when requiredRoles is undefined (empty array branch)', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles={undefined}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should grant access when requiredRolesArray is empty with user present', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles={[]}
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should handle options being null (defaults to empty object)', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      const NullOptionsComponent = ({ onResult }) => {
        const api = useRoleGuard(null);
        React.useEffect(() => {
          onResult(api);
        }, [api, onResult]);
        return null;
      };

      let api;
      render(<NullOptionsComponent onResult={(v) => (api = v)} />);

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should handle user with roles array but no role field', async () => {
      mockState.ui.user = { id: '1', roles: ['ADMIN', 'MODERATOR'] };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles="ADMIN"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });

    it('should handle user with no role and no roles (empty array fallback)', async () => {
      mockState.ui.user = { id: '1' };
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles="ADMIN"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(api.errorCode).toBeDefined();
      });
    });

    it('should handle userRoles as non-array string (normalize to array branch)', async () => {
      // Test line 59: Array.isArray(userRoles) ? userRoles : [userRoles]
      // When user.roles is a string (not an array), it should normalize to array
      mockState.ui.user = { id: '1', roles: 'ADMIN' }; // string instead of array
      mockState.ui.isAuthenticated = true;

      let api;
      render(
        <RoleGuardedComponent
          requiredRoles="ADMIN"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(true);
        expect(api.errorCode).toBeNull();
      });
    });
  });

  describe('Guard Composition', () => {
    it('should combine auth and role guards without conflicts when both pass', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN' };
      mockState.ui.isAuthenticated = true;

      let result;
      render(
        <ComposedGuardsComponent
          requiredRoles="ADMIN"
          redirectPath="/unauthorized"
          onResult={(v) => (result = v)}
        />
      );

      await waitFor(() => {
        expect(result.auth.authenticated).toBe(true);
        expect(result.role.hasAccess).toBe(true);
        expect(result.role.errorCode).toBeNull();
        // Auth guard should not redirect (skipRedirect: true)
        // Role guard should not redirect (hasAccess: true)
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('should handle auth guard authenticated branch in composition', async () => {
      // Test auth guard's authenticated branch (lines 38-40)
      // Start unauthenticated, then become authenticated
      mockState.ui.user = null;
      mockState.ui.isAuthenticated = false;

      const AuthTransitionComponent = ({ onResult }) => {
        const authApi = useAuthGuard({ skipRedirect: false });
        React.useEffect(() => {
          onResult(authApi);
        }, [authApi, onResult]);
        return null;
      };

      let result;
      const { rerender } = render(
        <AuthTransitionComponent onResult={(v) => (result = v)} />
      );

      await waitFor(() => {
        expect(result.authenticated).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/login');
      });

      // Transition to authenticated
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;
      mockRouter.replace.mockClear();

      rerender(<AuthTransitionComponent onResult={(v) => (result = v)} />);

      await waitFor(() => {
        expect(result.authenticated).toBe(true);
        // Should not redirect when authenticated (hasRedirected should reset)
      });
    });

    it('should handle auth guard with default options (no options provided)', async () => {
      mockState.ui.user = null;
      mockState.ui.isAuthenticated = false;

      const DefaultOptionsComponent = ({ onResult }) => {
        const authApi = useAuthGuard(); // No options provided
        React.useEffect(() => {
          onResult(authApi);
        }, [authApi, onResult]);
        return null;
      };

      let result;
      render(<DefaultOptionsComponent onResult={(v) => (result = v)} />);

      await waitFor(() => {
        expect(result.authenticated).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledWith('/login'); // Default redirect path
      });
    });

    it('should not redirect when hasRedirected is already true (auth guard)', async () => {
      mockState.ui.user = null;
      mockState.ui.isAuthenticated = false;

      // Component that maintains instance across state changes
      const PersistentAuthGuardComponent = ({ onResult }) => {
        const authApi = useAuthGuard({ skipRedirect: false });
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          onResult(authApi);
        }, [authApi, onResult]);

        // Trigger re-render without unmounting to test hasRedirected persistence
        React.useEffect(() => {
          if (count === 0) {
            setTimeout(() => setCount(1), 10);
          }
        }, [count]);

        return null;
      };

      let result;
      render(<PersistentAuthGuardComponent onResult={(v) => (result = v)} />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      }, { timeout: 1000 });

      // Wait for state update that triggers re-render
      await waitFor(() => {
        // Should not redirect again (hasRedirected.current is true, covering line 41 else branch)
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      }, { timeout: 1000 });
    });

    it('should not redirect when hasRedirected is already true (role guard)', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      // Component that maintains instance across state changes
      const PersistentRoleGuardComponent = ({ requiredRoles, onResult }) => {
        const api = useRoleGuard({ requiredRoles });
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          onResult(api);
        }, [api, onResult]);

        // Trigger re-render without unmounting to test hasRedirected persistence
        React.useEffect(() => {
          if (count === 0) {
            setTimeout(() => setCount(1), 10);
          }
        }, [count]);

        return null;
      };

      let api;
      render(
        <PersistentRoleGuardComponent
          requiredRoles="ADMIN"
          onResult={(v) => (api = v)}
        />
      );

      await waitFor(() => {
        expect(api.hasAccess).toBe(false);
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      }, { timeout: 1000 });

      // Wait for state update that triggers re-render
      await waitFor(() => {
        // Should not redirect again (hasRedirected.current is true, covering line 83 else branch)
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      }, { timeout: 1000 });
    });

    it('should combine auth and role guards without conflicts when auth fails', async () => {
      mockState.ui.user = null;
      mockState.ui.isAuthenticated = false;

      let result;
      render(
        <ComposedGuardsComponent
          requiredRoles="ADMIN"
          redirectPath="/unauthorized"
          onResult={(v) => (result = v)}
        />
      );

      await waitFor(() => {
        expect(result.auth.authenticated).toBe(false);
        expect(result.role.hasAccess).toBe(false);
        expect(result.role.errorCode).toBeDefined();
        // Auth guard should not redirect (skipRedirect: true)
        // Role guard should redirect (hasAccess: false)
        expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
      });
    });

    it('should combine auth and role guards without conflicts when role fails', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      let result;
      render(
        <ComposedGuardsComponent
          requiredRoles="ADMIN"
          redirectPath="/unauthorized"
          onResult={(v) => (result = v)}
        />
      );

      await waitFor(() => {
        expect(result.auth.authenticated).toBe(true);
        expect(result.role.hasAccess).toBe(false);
        expect(result.role.errorCode).toBeDefined();
        // Auth guard should not redirect (skipRedirect: true)
        // Role guard should redirect (hasAccess: false)
        expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
      });
    });

    it('should handle multiple role guards in same component without conflicts', async () => {
      mockState.ui.user = { id: '1', role: 'ADMIN' };
      mockState.ui.isAuthenticated = true;

      // Component with two role guards
      const MultiRoleComponent = ({ onResult }) => {
        const adminGuard = useRoleGuard({ requiredRoles: 'ADMIN', redirectPath: '/admin-unauthorized' });
        const moderatorGuard = useRoleGuard({ requiredRoles: 'MODERATOR', redirectPath: '/mod-unauthorized' });

        React.useEffect(() => {
          onResult({ admin: adminGuard, moderator: moderatorGuard });
        }, [adminGuard, moderatorGuard, onResult]);

        return null;
      };

      let result;
      render(<MultiRoleComponent onResult={(v) => (result = v)} />);

      await waitFor(() => {
        expect(result.admin.hasAccess).toBe(true);
        expect(result.moderator.hasAccess).toBe(false);
        // Only moderator guard should redirect
        expect(mockRouter.replace).toHaveBeenCalledWith('/mod-unauthorized');
        expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      });
    });

    it('should not cause redirect conflicts when multiple guards redirect to same path', async () => {
      mockState.ui.user = { id: '1', role: 'USER' };
      mockState.ui.isAuthenticated = true;

      // Component with two role guards using same redirect path
      const SameRedirectComponent = ({ onResult }) => {
        const guard1 = useRoleGuard({ requiredRoles: 'ADMIN', redirectPath: '/unauthorized' });
        const guard2 = useRoleGuard({ requiredRoles: 'MODERATOR', redirectPath: '/unauthorized' });

        React.useEffect(() => {
          onResult({ guard1, guard2 });
        }, [guard1, guard2, onResult]);

        return null;
      };

      let result;
      render(<SameRedirectComponent onResult={(v) => (result = v)} />);

      await waitFor(() => {
        expect(result.guard1.hasAccess).toBe(false);
        expect(result.guard2.hasAccess).toBe(false);
        // Both guards should redirect, but router.replace should be called
        // (each guard tracks its own redirect state, so both may call it)
        expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
      });
    });
  });
});
