/**
 * Public Layout Tests
 * File: public-layout.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import PublicLayoutRoute from '@app/(public)/_layout';
import { AuthLayout } from '@platform/layouts';
import { usePathname, useRouter } from 'expo-router';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
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

jest.mock('expo-router', () => ({
  Slot: () => {
    const { View } = require('react-native');
    return <View testID="public-slot" />;
  },
  usePathname: jest.fn(() => '/landing'),
  useRouter: jest.fn(() => ({ back: jest.fn(), canGoBack: jest.fn(() => false) })),
}));

describe('app/(public)/_layout.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePathname.mockReturnValue('/landing');
    useRouter.mockReturnValue({
      back: jest.fn(),
      canGoBack: jest.fn(() => false),
    });
  });

  test('renders public layout and slot with shared header props and landing back action', () => {
    const { getByTestId } = render(<PublicLayoutRoute />);
    expect(getByTestId('public-group-layout')).toBeTruthy();
    expect(getByTestId('public-slot')).toBeTruthy();
    expect(AuthLayout).toHaveBeenCalled();

    const props = AuthLayout.mock.calls[0][0];
    expect(props.showScreenHeader).toBe(true);
    expect(props.screenTitle).toBe('landing.title');
    expect(props.screenSubtitle).toBe('landing.badge');
    expect(props.screenBackAction).toEqual(
      expect.objectContaining({
        label: 'common.back',
        hint: 'common.backHint',
        disabled: true,
        disabledHint: 'landing.backUnavailableHint',
        testID: 'public-layout-back',
      })
    );
  });

  test('enables public back action when history is available on non-landing routes', () => {
    const mockBack = jest.fn();
    usePathname.mockReturnValue('/public-help');
    useRouter.mockReturnValue({
      back: mockBack,
      canGoBack: jest.fn(() => true),
    });

    render(<PublicLayoutRoute />);
    const props = AuthLayout.mock.calls[0][0];
    expect(props.screenBackAction.disabled).toBe(false);

    props.screenBackAction.onPress();
    expect(mockBack).toHaveBeenCalled();
  });

  test('uses terms metadata and back action on terms route', () => {
    usePathname.mockReturnValue('/terms');
    useRouter.mockReturnValue({
      back: jest.fn(),
      canGoBack: jest.fn(() => false),
    });

    render(<PublicLayoutRoute />);
    const props = AuthLayout.mock.calls[0][0];

    expect(props.screenTitle).toBe('terms.title');
    expect(props.screenSubtitle).toBe('terms.subtitle');
    expect(props.screenBackAction.disabled).toBe(true);
    expect(props.screenBackAction.disabledHint).toBe('terms.backUnavailableHint');
  });
});
