import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useRoleGuard, ROLE_GUARD_ERRORS } from '@navigation/guards/role.guard';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

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
    jest.clearAllMocks();

    mockRouter = {
      replace: jest.fn(),
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    mockState = {
      _persist: { rehydrated: true },
      auth: {
        user: null,
      },
      ui: {
        user: null,
      },
    };

    useSelector.mockImplementation((selector) => selector(mockState));
  });

  it('grants access when user has a canonical required role', async () => {
    mockState.auth.user = { id: '1', role: 'TENANT_ADMIN' };

    let api;
    render(<TestComponent options={{ requiredRoles: 'TENANT_ADMIN' }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasAccess).toBe(true);
      expect(api.errorCode).toBeNull();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('normalizes legacy aliases and case-insensitive role values', async () => {
    mockState.auth.user = { id: '1', role: 'admin' };

    let api;
    render(<TestComponent options={{ requiredRoles: 'TENANT_ADMIN' }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasAccess).toBe(true);
      expect(api.errorCode).toBeNull();
    });
  });

  it('normalizes required role aliases', async () => {
    mockState.auth.user = { id: '1', role: 'TENANT_ADMIN' };

    let api;
    render(<TestComponent options={{ requiredRoles: 'ADMIN' }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasAccess).toBe(true);
      expect(api.errorCode).toBeNull();
    });
  });

  it('normalizes ambulance role aliases for access checks', async () => {
    mockState.auth.user = { id: '1', role: 'ambulance_driver' };

    let api;
    render(
      <TestComponent options={{ requiredRoles: 'AMBULANCE_OPERATOR' }} onResult={(v) => (api = v)} />
    );

    await waitFor(() => {
      expect(api.hasAccess).toBe(true);
      expect(api.errorCode).toBeNull();
    });
  });

  it('denies access and redirects when user lacks role', async () => {
    mockState.auth.user = { id: '1', role: 'BILLING' };

    let api;
    render(<TestComponent options={{ requiredRoles: 'HR' }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasAccess).toBe(false);
      expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE);
      expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('returns NO_USER when user is missing', async () => {
    let api;
    render(<TestComponent options={{ requiredRoles: 'HR' }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasAccess).toBe(false);
      expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.NO_USER);
      expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('does not redirect when no required roles are specified', async () => {
    mockState.auth.user = { id: '1', role: 'BILLING' };

    let api;
    render(<TestComponent options={{}} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasAccess).toBe(true);
      expect(api.errorCode).toBeNull();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('waits for persistence rehydration before redirecting', async () => {
    mockState._persist.rehydrated = false;

    let api;
    render(<TestComponent options={{ requiredRoles: 'HR' }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasAccess).toBe(false);
      expect(api.errorCode).toBe(ROLE_GUARD_ERRORS.NO_USER);
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });
});
