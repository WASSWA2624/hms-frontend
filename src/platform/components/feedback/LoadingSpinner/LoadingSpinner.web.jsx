/**
 * LoadingSpinner Component - Web
 * Loading indicator component for Web platform
 * File: LoadingSpinner.web.jsx
 */

import React from 'react';
import { StyledContainer, StyledSpinner } from './LoadingSpinner.web.styles';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * LoadingSpinner component for Web
 * @param {Object} props - LoadingSpinner props
 * @param {string} props.size - Spinner size (small, medium, large)
 * @param {string} props.color - Spinner color (overrides theme default)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const LoadingSpinnerWeb = ({
  size = SIZES.MEDIUM,
  color,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const defaultAccessibilityLabel = accessibilityLabel || t('common.loading');
  
  return (
    <StyledContainer
      style={style}
      className={className}
      testID={testID}
      role="status"
      aria-label={defaultAccessibilityLabel}
      aria-live="polite"
      aria-description={accessibilityHint}
      data-testid={testID}
      {...rest}
    >
      <StyledSpinner size={size} color={color} />
    </StyledContainer>
  );
};

export default LoadingSpinnerWeb;

