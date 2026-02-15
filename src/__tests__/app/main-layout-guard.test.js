import React from 'react';
import { render } from '@testing-library/react-native';
import MainLayout from '@app/(main)/_layout';
import { useAuthGuard } from '@navigation/guards';

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
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
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
  });

  test('renders main route layout for authenticated users', () => {
    const { getByTestId } = render(<MainLayout />);
    expect(getByTestId('main-route-layout')).toBeTruthy();
  });

  test('invokes auth guard on render', () => {
    render(<MainLayout />);
    expect(useAuthGuard).toHaveBeenCalledTimes(1);
  });

  test('invokes auth guard with default options (login redirect handled in hook)', () => {
    render(<MainLayout />);
    expect(useAuthGuard).toHaveBeenCalledWith();
  });

  test('remains stable when unauthenticated', () => {
    useAuthGuard.mockReturnValue({
      authenticated: false,
      user: null,
    });

    const { getByTestId } = render(<MainLayout />);
    expect(getByTestId('main-route-layout')).toBeTruthy();
    expect(useAuthGuard).toHaveBeenCalledTimes(1);
  });
});

