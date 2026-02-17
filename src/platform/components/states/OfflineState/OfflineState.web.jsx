/**
 * OfflineState Component - Web
 * Offline state display with icon, title, description, and optional retry action
 * File: OfflineState.web.jsx
 */

import React from 'react';
import { StyledOfflineState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer } from './OfflineState.web.styles';
import { useOfflineState } from './useOfflineState';
import { SIZES } from './types';
import { useI18n } from '@hooks';

/**
 * OfflineState component for Web
 * @param {Object} props - OfflineState props
 * @param {string} props.size - OfflineState size (small, medium, large)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string|React.ReactNode} props.title - Title text (should be i18n'd by consumer)
 * @param {string|React.ReactNode} props.description - Description text (should be i18n'd by consumer)
 * @param {React.ReactNode} props.action - Retry action button or element
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const OfflineStateWeb = ({
  size = SIZES.MEDIUM,
  icon,
  title,
  description,
  action,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const offlineState = useOfflineState({ size });
  const defaultAccessibilityLabel =
    accessibilityLabel ||
    (typeof title === 'string' && title ? title : t('common.offlineState'));

  return (
    <StyledOfflineState
      size={offlineState.size}
      role="status"
      aria-label={defaultAccessibilityLabel}
      data-testid={testID}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {icon && (
        <StyledIconContainer size={offlineState.size}>
          {icon}
        </StyledIconContainer>
      )}
      {title && (
        <StyledTitle size={offlineState.size}>
          {title}
        </StyledTitle>
      )}
      {description && (
        <StyledDescription size={offlineState.size}>
          {description}
        </StyledDescription>
      )}
      {action && (
        <StyledActionContainer>
          {action}
        </StyledActionContainer>
      )}
    </StyledOfflineState>
  );
};

export default OfflineStateWeb;

