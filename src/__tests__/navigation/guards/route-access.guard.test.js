import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { usePathname, useRouter } from 'expo-router';
import useAuth from '@hooks/useAuth';
import useResolvedRoles from '@hooks/useResolvedRoles';
import useNavigationVisibility from '@hooks/useNavigationVisibility';
import {
  useRouteAccessGuard,
  ROUTE_ACCESS_GUARD_ERRORS,
} from '@navigation/guards/route-access.guard';

jest.mock('expo-router', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@hooks/useResolvedRoles', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@hooks/useNavigationVisibility', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const createVisibilityMock = (hiddenPaths = []) => {
  const hidden = new Set(hiddenPaths);
  return jest.fn((item) => !hidden.has(item?.path));
};

const HookHarness = ({ options, onResult }) => {
  const result = useRouteAccessGuard(options);

  React.useEffect(() => {
    onResult(result);
  }, [onResult, result]);

  return null;
};

describe('useRouteAccessGuard', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ replace: mockReplace, push: jest.fn() });
    usePathname.mockReturnValue('/dashboard');
    useAuth.mockReturnValue({ isAuthenticated: true });
    useResolvedRoles.mockReturnValue({ isResolved: true });
    useNavigationVisibility.mockReturnValue({
      isItemVisible: createVisibilityMock(),
    });
  });

  it('redirects when a matched route is not visible for the current role', async () => {
    usePathname.mockReturnValue('/settings/users');
    useNavigationVisibility.mockReturnValue({
      isItemVisible: createVisibilityMock(['/settings/users']),
    });

    let hookResult;
    render(<HookHarness options={{ redirectPath: '/dashboard' }} onResult={(v) => (hookResult = v)} />);

    await waitFor(() => {
      expect(hookResult.hasAccess).toBe(false);
      expect(hookResult.errorCode).toBe(ROUTE_ACCESS_GUARD_ERRORS.ACCESS_DENIED);
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('does not redirect when route is visible', async () => {
    usePathname.mockReturnValue('/settings');

    let hookResult;
    render(<HookHarness options={{ redirectPath: '/dashboard' }} onResult={(v) => (hookResult = v)} />);

    await waitFor(() => {
      expect(hookResult.hasAccess).toBe(true);
      expect(hookResult.errorCode).toBeNull();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('waits for role resolution before redirecting guarded routes', async () => {
    usePathname.mockReturnValue('/settings/users');
    useResolvedRoles.mockReturnValue({ isResolved: false });
    useNavigationVisibility.mockReturnValue({
      isItemVisible: createVisibilityMock(['/settings/users']),
    });

    let hookResult;
    render(<HookHarness options={{ redirectPath: '/dashboard' }} onResult={(v) => (hookResult = v)} />);

    await waitFor(() => {
      expect(hookResult.hasAccess).toBe(false);
      expect(hookResult.isPending).toBe(true);
      expect(hookResult.errorCode).toBeNull();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('allows unknown paths that do not map to nav entries', async () => {
    usePathname.mockReturnValue('/unknown-path/example');
    useNavigationVisibility.mockReturnValue({
      isItemVisible: jest.fn(() => false),
    });

    let hookResult;
    render(<HookHarness options={{ redirectPath: '/dashboard' }} onResult={(v) => (hookResult = v)} />);

    await waitFor(() => {
      expect(hookResult.hasAccess).toBe(true);
      expect(hookResult.errorCode).toBeNull();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('does not redirect for explicitly skipped paths', async () => {
    usePathname.mockReturnValue('/settings/users');
    useNavigationVisibility.mockReturnValue({
      isItemVisible: createVisibilityMock(['/settings/users']),
    });

    let hookResult;
    render(
      <HookHarness
        options={{ redirectPath: '/dashboard', skipPaths: ['/settings/users'] }}
        onResult={(v) => (hookResult = v)}
      />
    );

    await waitFor(() => {
      expect(hookResult.hasAccess).toBe(false);
      expect(hookResult.errorCode).toBe(ROUTE_ACCESS_GUARD_ERRORS.ACCESS_DENIED);
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});

