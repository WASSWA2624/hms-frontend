import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useRoleGuard, useAuthGuard } from '@navigation/guards';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Slot: ({ children }) => children || null,
}));

jest.mock('@store/selectors', () => ({
  selectUser: jest.fn((state) => state.ui?.user),
  selectIsAuthenticated: jest.fn((state) => state.ui?.isAuthenticated),
}));

const RoleGuardedComponent = ({ requiredRoles, redirectPath, onResult }) => {
  const api = useRoleGuard({ requiredRoles, redirectPath });

  React.useEffect(() => {
    onResult(api);
  }, [api, onResult]);

  return null;
};

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
    jest.clearAllMocks();

    mockRouter = {
      replace: jest.fn(),
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    mockState = {
      _persist: { rehydrated: true },
      ui: {
        user: null,
        isAuthenticated: false,
      },
    };

    useSelector.mockImplementation((selector) => selector(mockState));
  });

  it('allows matching canonical role in route context', async () => {
    mockState.ui.user = { id: '1', role: 'BILLING' };
    mockState.ui.isAuthenticated = true;

    let api;
    render(
      <RoleGuardedComponent
        requiredRoles="BILLING"
        redirectPath="/unauthorized"
        onResult={(value) => {
          api = value;
        }}
      />
    );

    await waitFor(() => {
      expect(api.hasAccess).toBe(true);
      expect(api.errorCode).toBeNull();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('accepts alias role values in required roles', async () => {
    mockState.ui.user = { id: '1', role: 'TENANT_ADMIN' };
    mockState.ui.isAuthenticated = true;

    let api;
    render(
      <RoleGuardedComponent
        requiredRoles="ADMIN"
        redirectPath="/unauthorized"
        onResult={(value) => {
          api = value;
        }}
      />
    );

    await waitFor(() => {
      expect(api.hasAccess).toBe(true);
      expect(api.errorCode).toBeNull();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('redirects when role requirement is not met', async () => {
    mockState.ui.user = { id: '1', role: 'HOUSE_KEEPER' };
    mockState.ui.isAuthenticated = true;

    let api;
    render(
      <RoleGuardedComponent
        requiredRoles="BIOMED"
        redirectPath="/unauthorized"
        onResult={(value) => {
          api = value;
        }}
      />
    );

    await waitFor(() => {
      expect(api.hasAccess).toBe(false);
      expect(api.errorCode).toBeDefined();
      expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
    });
  });

  it('composes auth and role guards without conflicts', async () => {
    mockState.ui.user = { id: '1', role: 'RECEPTIONIST' };
    mockState.ui.isAuthenticated = true;

    let result;
    render(
      <ComposedGuardsComponent
        requiredRoles="RECEPTIONIST"
        redirectPath="/unauthorized"
        onResult={(value) => {
          result = value;
        }}
      />
    );

    await waitFor(() => {
      expect(result.auth.authenticated).toBe(true);
      expect(result.role.hasAccess).toBe(true);
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('keeps auth redirect disabled in composed auth guard when unauthenticated', async () => {
    mockState.ui.user = null;
    mockState.ui.isAuthenticated = false;

    let result;
    render(
      <ComposedGuardsComponent
        requiredRoles="RECEPTIONIST"
        redirectPath="/unauthorized"
        onResult={(value) => {
          result = value;
        }}
      />
    );

    await waitFor(() => {
      expect(result.auth.authenticated).toBe(false);
      expect(result.role.hasAccess).toBe(false);
      expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
    });
  });
});