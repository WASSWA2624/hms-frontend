/**
 * Auth Layout Tests
 * File: auth-layout.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import AuthLayoutRoute from '@app/(auth)/_layout';
import { AuthLayout } from '@platform/layouts';
import { usePathname, useRouter } from 'expo-router';

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
  usePathname: jest.fn(() => '/login'),
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
}));

describe('app/(auth)/_layout.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePathname.mockReturnValue('/login');
    useRouter.mockReturnValue({
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => false),
    });
  });

  test('renders auth layout and slot', () => {
    const { getByTestId } = render(<AuthLayoutRoute />);
    expect(getByTestId('auth-group-layout')).toBeTruthy();
    expect(getByTestId('auth-slot')).toBeTruthy();
    expect(AuthLayout).toHaveBeenCalled();
    const props = AuthLayout.mock.calls[0][0];
    expect(props.footer).toBeTruthy();
    expect(props.footer.props.testID).toBe('auth-footer');
    expect(props.showScreenHeader).toBe(true);
    expect(props.screenTitle).toBe('auth.login.title');
    expect(props.screenSubtitle).toBe('auth.login.description');
    expect(props.screenBackAction.disabled).toBe(true);
  });

  test('passes register header props and disables back when history is unavailable', () => {
    const mockBack = jest.fn();
    usePathname.mockReturnValue('/register');
    useRouter.mockReturnValue({
      replace: jest.fn(),
      back: mockBack,
      canGoBack: jest.fn(() => false),
    });

    render(<AuthLayoutRoute />);
    const props = AuthLayout.mock.calls[0][0];

    expect(props.showScreenHeader).toBe(true);
    expect(props.screenTitle).toBe('onboarding.layout.title');
    expect(props.screenSubtitle).toBe('auth.register.onboarding.subtitle');
    expect(props.screenBackAction.disabled).toBe(true);
    expect(props.screenBackAction.disabledHint).toBe('auth.layout.backUnavailableHint');
  });

  test('enables register back action when history is available', () => {
    const mockBack = jest.fn();
    usePathname.mockReturnValue('/register');
    useRouter.mockReturnValue({
      replace: jest.fn(),
      back: mockBack,
      canGoBack: jest.fn(() => true),
    });

    render(<AuthLayoutRoute />);
    const props = AuthLayout.mock.calls[0][0];

    expect(props.screenBackAction.disabled).toBe(false);
    props.screenBackAction.onPress();
    expect(mockBack).toHaveBeenCalled();
  });

  test('uses facility selection header metadata on facility-selection route', () => {
    usePathname.mockReturnValue('/facility-selection');
    useRouter.mockReturnValue({
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
    });

    render(<AuthLayoutRoute />);
    const props = AuthLayout.mock.calls[0][0];

    expect(props.screenTitle).toBe('auth.facilitySelection.title');
    expect(props.screenSubtitle).toBe('auth.facilitySelection.description');
  });

  test('normalizes grouped trailing-slash auth routes for header metadata', () => {
    usePathname.mockReturnValue('/(auth)/facility-selection/');
    useRouter.mockReturnValue({
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
    });

    render(<AuthLayoutRoute />);
    const props = AuthLayout.mock.calls[0][0];

    expect(props.screenTitle).toBe('auth.facilitySelection.title');
    expect(props.screenSubtitle).toBe('auth.facilitySelection.description');
  });
});
