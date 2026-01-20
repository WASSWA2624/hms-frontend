/**
 * LoadingSpinner Component - iOS
 * Loading indicator component for iOS platform
 * File: LoadingSpinner.ios.jsx
 */

import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import { StyledContainer, StyledSpinner } from './LoadingSpinner.ios.styles';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * LoadingSpinner component for iOS
 * @param {Object} props - LoadingSpinner props
 * @param {string} props.size - Spinner size (small, medium, large)
 * @param {string} props.color - Spinner color (overrides theme default)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const LoadingSpinnerIOS = ({
  size = SIZES.MEDIUM,
  color,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const theme = useTheme();
  const defaultAccessibilityLabel = accessibilityLabel || t('common.loading');
  
  const getSize = () => {
    const sizes = {
      small: 'small',
      medium: 'small',
      large: 'large',
    };
    return sizes[size] || sizes.medium;
  };

  const getColor = () => {
    if (color) return color;
    // Use theme primary color as default
    return theme.colors.primary;
  };

  return (
    <StyledContainer
      style={style}
      testID={testID}
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="progressbar"
      {...rest}
    >
      <StyledSpinner size={getSize()} color={getColor()} />
    </StyledContainer>
  );
};

export default LoadingSpinnerIOS;

