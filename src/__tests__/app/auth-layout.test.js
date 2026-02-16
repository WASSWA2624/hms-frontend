/**
 * Auth Layout Tests
 * File: auth-layout.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import AuthLayoutRoute from '@app/(auth)/_layout';
import { AuthLayout } from '@platform/layouts';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
  useSessionRestore: () => ({ isReady: true }),
}));

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(() => ({ authenticated: false, user: null })),
}));

jest.mock('@platform/layouts', () => ({
  AuthLayout: jest.fn(({ children, testID, accessibilityLabel }) => {
    const { View } = require('react-native');
    return (
      <View testID={testID} accessibilityLabel={accessibilityLabel}>
      {children}
      </View>
    );
  }),
}));

jest.mock('@platform/components/navigation/GlobalFooter', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: jest.fn(({ testID }) => <View testID={testID || 'auth-footer'} />),
    FOOTER_VARIANTS: {
      AUTH: 'auth',
    },
  };
});

jest.mock('expo-router', () => ({
  Slot: () => {
    const { View } = require('react-native');
    return <View testID="auth-slot" />;
  },
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
}));

describe('app/(auth)/_layout.jsx', () => {
  test('renders auth layout and slot', () => {
    const { getByTestId } = render(<AuthLayoutRoute />);
    expect(getByTestId('auth-group-layout')).toBeTruthy();
    expect(getByTestId('auth-slot')).toBeTruthy();
    expect(AuthLayout).toHaveBeenCalled();
    expect(AuthLayout.mock.calls[0][0].footer).toBeTruthy();
    expect(AuthLayout.mock.calls[0][0].footer.props.testID).toBe('auth-footer');
  });
});
