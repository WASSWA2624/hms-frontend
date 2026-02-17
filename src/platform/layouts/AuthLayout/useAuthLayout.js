/**
 * useAuthLayout Hook
 * Shared slot visibility and accessibility defaults for AuthLayout
 * File: useAuthLayout.js
 */

import { useMemo } from 'react';

const useAuthLayout = ({
  accessibilityLabel,
  showScreenHeader,
  screenTitle,
  screenSubtitle,
  screenBackAction,
  t,
}) => {
  return useMemo(() => {
    const hasScreenHeader = Boolean(showScreenHeader && (screenTitle || screenSubtitle || screenBackAction));
    const hasBackAction = Boolean(screenBackAction);
    const isBackDisabled =
      !hasBackAction ||
      Boolean(screenBackAction?.disabled) ||
      typeof screenBackAction?.onPress !== 'function';
    const resolvedBackLabel = screenBackAction?.label || t('common.back');
    const resolvedBackHint = isBackDisabled
      ? screenBackAction?.disabledHint || t('auth.layout.backUnavailableHint')
      : screenBackAction?.hint || t('common.backHint');

    return {
      hasScreenHeader,
      hasBackAction,
      isBackDisabled,
      resolvedBackLabel,
      resolvedBackHint,
      resolvedAccessibilityLabel: accessibilityLabel || t('auth.layout.title'),
      resolvedScreenHeaderLabel: screenTitle || t('auth.layout.title'),
    };
  }, [
    accessibilityLabel,
    showScreenHeader,
    screenTitle,
    screenSubtitle,
    screenBackAction,
    t,
  ]);
};

export default useAuthLayout;
