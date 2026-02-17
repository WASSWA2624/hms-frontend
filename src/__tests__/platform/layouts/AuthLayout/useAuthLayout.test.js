/**
 * useAuthLayout Hook Tests
 * File: useAuthLayout.test.js
 */

import { renderHook } from '@testing-library/react-native';
import useAuthLayout from '@platform/layouts/AuthLayout/useAuthLayout';

const createTranslator = () => {
  const dictionary = {
    'common.back': 'Back',
    'common.backHint': 'Return to previous page',
    'auth.layout.backUnavailableHint': 'Back is unavailable',
    'auth.layout.title': 'Welcome',
  };

  return (key) => dictionary[key] || key;
};

describe('useAuthLayout', () => {
  const t = createTranslator();

  it('returns default accessibility values when optional props are missing', () => {
    const { result } = renderHook(() =>
      useAuthLayout({
        t,
      })
    );

    expect(result.current.hasScreenHeader).toBe(false);
    expect(result.current.hasBackAction).toBe(false);
    expect(result.current.isBackDisabled).toBe(true);
    expect(result.current.resolvedAccessibilityLabel).toBe('Welcome');
    expect(result.current.resolvedScreenHeaderLabel).toBe('Welcome');
  });

  it('returns enabled back action values when handler is provided', () => {
    const onPress = jest.fn();
    const { result } = renderHook(() =>
      useAuthLayout({
        t,
        showScreenHeader: true,
        screenTitle: 'Onboarding',
        screenSubtitle: 'Setup details',
        screenBackAction: {
          label: 'Go Back',
          hint: 'Go to previous step',
          onPress,
        },
      })
    );

    expect(result.current.hasScreenHeader).toBe(true);
    expect(result.current.hasBackAction).toBe(true);
    expect(result.current.isBackDisabled).toBe(false);
    expect(result.current.resolvedBackLabel).toBe('Go Back');
    expect(result.current.resolvedBackHint).toBe('Go to previous step');
    expect(result.current.resolvedScreenHeaderLabel).toBe('Onboarding');
  });

  it('falls back to disabled hint when back action is missing handler', () => {
    const { result } = renderHook(() =>
      useAuthLayout({
        t,
        showScreenHeader: true,
        screenBackAction: {
          label: 'Go Back',
        },
      })
    );

    expect(result.current.hasScreenHeader).toBe(true);
    expect(result.current.isBackDisabled).toBe(true);
    expect(result.current.resolvedBackHint).toBe('Back is unavailable');
  });

  it('uses provided accessibility label and disabled hint overrides', () => {
    const { result } = renderHook(() =>
      useAuthLayout({
        t,
        accessibilityLabel: 'Custom auth area',
        showScreenHeader: true,
        screenBackAction: {
          disabled: true,
          disabledHint: 'Custom disabled hint',
          onPress: jest.fn(),
        },
      })
    );

    expect(result.current.resolvedAccessibilityLabel).toBe('Custom auth area');
    expect(result.current.resolvedBackHint).toBe('Custom disabled hint');
    expect(result.current.isBackDisabled).toBe(true);
  });
});
