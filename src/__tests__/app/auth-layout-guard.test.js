/**
 * Auth Layout Guard Integration Tests
 * File: auth-layout-guard.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AuthLayoutRoute from '@app/(auth)/_layout';
import { useAuthGuard } from '@navigation/guards';
import { useRouter } from 'expo-router';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
  useSessionRestore: () => ({ isReady: true }),
}));

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
}));

jest.mock('@platform/layouts', () => ({
  AuthLayout: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('@platform/components/navigation/GlobalFooter', () => ({
  __esModule: true,
  default: jest.fn(() => null),
  FOOTER_VARIANTS: {
    AUTH: 'auth',
  },
}));

jest.mock('expo-router', () => ({
  Slot: () => <div data-testid="auth-slot" />,
  usePathname: jest.fn(() => '/login'),
  useRouter: jest.fn(),
}));

describe('app/(auth)/_layout guard wiring', () => {
  let mockRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { replace: jest.fn(), push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
  });

  test('calls useAuthGuard with skipRedirect=true', () => {
    useAuthGuard.mockReturnValue({ authenticated: false, user: null });
    render(<AuthLayoutRoute />);
    expect(useAuthGuard).toHaveBeenCalledWith(
      expect.objectContaining({ skipRedirect: true })
    );
  });

  test('redirects authenticated users to /dashboard', async () => {
    useAuthGuard.mockReturnValue({ authenticated: true, user: { id: '1' } });
    render(<AuthLayoutRoute />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('does not redirect unauthenticated users', async () => {
    useAuthGuard.mockReturnValue({ authenticated: false, user: null });
    render(<AuthLayoutRoute />);

    await waitFor(() => {
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });
});
