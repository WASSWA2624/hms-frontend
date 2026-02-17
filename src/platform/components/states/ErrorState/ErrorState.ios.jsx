/**
 * ErrorState Component - iOS
 * Error state display with icon, title, description, and optional retry action
 * File: ErrorState.ios.jsx
 */

import React from 'react';
import { StyledErrorState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer } from './ErrorState.ios.styles';
import { useErrorState } from './useErrorState';
import { SIZES } from './types';
import Icon, { SIZES as IconSizes, TONES } from '@platform/components/display/Icon';
import { useI18n } from '@hooks';

/**
 * ErrorState component for iOS
 * @param {Object} props - ErrorState props
 * @param {string} props.size - ErrorState size (small, medium, large)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string|React.ReactNode} props.title - Title text (should be i18n'd by consumer)
 * @param {string|React.ReactNode} props.description - Description text (should be i18n'd by consumer)
 * @param {React.ReactNode} props.action - Retry action button or element
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ErrorStateIOS = ({
  size = SIZES.MEDIUM,
  icon,
  title,
  description,
  action,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const errorState = useErrorState({ size });
  const defaultAccessibilityLabel =
    accessibilityLabel ||
    (typeof title === 'string' && title ? title : t('common.errorState'));
  const iconSizeMap = { small: IconSizes.SM, medium: IconSizes.MD, large: IconSizes.LG };
  const defaultIcon = !icon && (
    <Icon
      glyph="!"
      size={iconSizeMap[errorState.size]}
      tone={TONES.ERROR}
      decorative
    />
  );
  const iconToRender = icon || defaultIcon;

  return (
    <StyledErrorState
      size={errorState.size}
      accessibilityRole="alert"
      accessibilityLabel={defaultAccessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      {iconToRender && (
        <StyledIconContainer size={errorState.size}>
          {iconToRender}
        </StyledIconContainer>
      )}
      {title && (
        <StyledTitle size={errorState.size}>
          {title}
        </StyledTitle>
      )}
      {description && (
        <StyledDescription size={errorState.size}>
          {description}
        </StyledDescription>
      )}
      {action && (
        <StyledActionContainer>
          {action}
        </StyledActionContainer>
      )}
    </StyledErrorState>
  );
};

export default ErrorStateIOS;

