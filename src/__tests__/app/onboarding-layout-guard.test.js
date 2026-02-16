/**
 * Onboarding Layout Guard Integration Tests
 * File: onboarding-layout-guard.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import OnboardingLayoutRoute from '@app/(onboarding)/_layout';
import { usePathname, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { readOnboardingProgress, readRegistrationContext, saveAuthResumeContext } from '@navigation';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
  useSessionRestore: () => ({ isReady: true }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => {
  const { View } = require('react-native');
  return {
    Slot: () => <View testID="onboarding-slot" />,
    usePathname: jest.fn(),
    useRouter: jest.fn(),
  };
});

jest.mock('@platform/components', () => {
  const { View } = require('react-native');
  return {
    LoadingSpinner: ({ testID }) => <View testID={testID || 'loading-spinner'} />,
  };
});

jest.mock('@platform/layouts', () => {
  const { View } = require('react-native');
  return {
    AuthLayout: jest.fn(({ children, testID }) => <View testID={testID || 'onboarding-layout'}>{children}</View>),
  };
});

jest.mock('@navigation', () => ({
  readOnboardingProgress: jest.fn(),
  readRegistrationContext: jest.fn(),
  saveAuthResumeContext: jest.fn(),
}));

describe('app/(onboarding)/_layout guard behavior', () => {
  let mockRouter;

  const setStoreState = (state) => {
    useSelector.mockImplementation((selector) => selector(state));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = {
      replace: jest.fn(),
      push: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => false),
    };
    useRouter.mockReturnValue(mockRouter);
    usePathname.mockReturnValue('/plan');
    readOnboardingProgress.mockResolvedValue({ context: {} });
    readRegistrationContext.mockResolvedValue({ email: 'owner@example.com' });
    saveAuthResumeContext.mockResolvedValue(true);
  });

  test('redirects unauthenticated users on auth-required onboarding paths', async () => {
    setStoreState({
      auth: { isAuthenticated: false },
      _persist: { rehydrated: true },
    });

    render(<OnboardingLayoutRoute />);

    await waitFor(() => {
      expect(saveAuthResumeContext).toHaveBeenCalledWith({
        identifier: 'owner@example.com',
        next_path: '/plan',
        params: {},
      });
    });
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  test('does not redirect on non-auth-required onboarding paths', async () => {
    usePathname.mockReturnValue('/welcome');
    setStoreState({
      auth: { isAuthenticated: false },
      _persist: { rehydrated: true },
    });

    const { getByTestId } = render(<OnboardingLayoutRoute />);

    await waitFor(() => {
      expect(getByTestId('onboarding-slot')).toBeTruthy();
    });
    expect(saveAuthResumeContext).not.toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  test('passes onboarding header props with disabled back reason when history is unavailable', async () => {
    const { AuthLayout } = require('@platform/layouts');
    usePathname.mockReturnValue('/welcome');
    mockRouter.canGoBack.mockReturnValue(false);
    setStoreState({
      auth: { isAuthenticated: false },
      _persist: { rehydrated: true },
    });

    render(<OnboardingLayoutRoute />);

    await waitFor(() => {
      expect(AuthLayout).toHaveBeenCalled();
    });

    const props = AuthLayout.mock.calls[0][0];
    expect(props.showScreenHeader).toBe(true);
    expect(props.screenTitle).toBe('onboarding.welcome.title');
    expect(props.screenSubtitle).toBe('onboarding.welcome.description');
    expect(props.screenBackAction.disabled).toBe(true);
    expect(props.screenBackAction.disabledHint).toBe('onboarding.layout.backUnavailableHint');
  });
});
