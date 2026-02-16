import React from 'react';
import { render } from '@testing-library/react-native';
import MainLayout from '@app/(main)/_layout';
import { useSessionRestore } from '@hooks';
import { useAuthGuard, useRouteAccessGuard } from '@navigation/guards';

jest.mock('@hooks', () => ({
  useSessionRestore: jest.fn(),
}));

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
  useRouteAccessGuard: jest.fn(),
}));

jest.mock('@platform/layouts', () => ({
  MainRouteLayout: () => {
    const { View } = require('react-native');
    return <View testID="main-route-layout" />;
  },
}));

describe('MainLayout with Auth Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSessionRestore.mockReturnValue({ isReady: true });
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
    useRouteAccessGuard.mockReturnValue({
      hasAccess: true,
      isPending: false,
      errorCode: null,
    });
  });

  test('renders main route layout for authenticated users', () => {
    const { getByTestId } = render(<MainLayout />);
    expect(getByTestId('main-route-layout')).toBeTruthy();
  });

  test('invokes auth guard on render', () => {
    render(<MainLayout />);
    expect(useAuthGuard).toHaveBeenCalledTimes(1);
    expect(useRouteAccessGuard).toHaveBeenCalledTimes(1);
  });

  test('invokes auth guard with default options (login redirect handled in hook)', () => {
    render(<MainLayout />);
    expect(useAuthGuard).toHaveBeenCalledWith(
      expect.objectContaining({ skipRedirect: false })
    );
    expect(useRouteAccessGuard).toHaveBeenCalledWith();
  });

  test('remains stable when unauthenticated', () => {
    useAuthGuard.mockReturnValue({
      authenticated: false,
      user: null,
    });
    useRouteAccessGuard.mockReturnValue({
      hasAccess: false,
      isPending: false,
      errorCode: 'ACCESS_DENIED',
    });

    const { queryByTestId } = render(<MainLayout />);
    expect(queryByTestId('main-route-layout')).toBeNull();
    expect(useAuthGuard).toHaveBeenCalledTimes(1);
    expect(useRouteAccessGuard).toHaveBeenCalledTimes(1);
  });
});

