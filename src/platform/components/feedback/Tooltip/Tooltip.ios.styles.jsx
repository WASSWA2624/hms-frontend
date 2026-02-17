/**
 * Tooltip iOS Styles
 * Styled-components for iOS platform
 * File: Tooltip.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledTooltip = styled.View.withConfig({
  displayName: 'StyledTooltip',
  componentId: 'StyledTooltip',
})`
  position: absolute;
  z-index: 10000;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.tooltip.background};
  max-width: ${({ theme }) => theme.spacing.xxl * 4}px;
  shadow-color: ${({ theme }) => theme.shadows.sm.shadowColor};
  shadow-offset: ${({ theme }) => theme.shadows.sm.shadowOffset.width}px
    ${({ theme }) => theme.shadows.sm.shadowOffset.height}px;
  shadow-opacity: ${({ theme }) => theme.shadows.sm.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.shadows.sm.shadowRadius}px;
  ${({ position, theme }) => {
    const margin = theme.spacing.sm;
    if (position === 'top') {
      return `bottom: 100%; margin-bottom: ${margin}px;`;
    }
    if (position === 'bottom') {
      return `top: 100%; margin-top: ${margin}px;`;
    }
    if (position === 'left') {
      return `right: 100%; margin-right: ${margin}px;`;
    }
    return `left: 100%; margin-left: ${margin}px;`;
  }}
`;

const StyledTooltipText = styled.Text.withConfig({
  displayName: 'StyledTooltipText',
  componentId: 'StyledTooltipText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.tooltip.text};
  text-align: center;
`;

export { StyledTooltip, StyledTooltipText };


