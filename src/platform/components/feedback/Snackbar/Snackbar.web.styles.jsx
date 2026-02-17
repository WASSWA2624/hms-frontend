/**
 * Snackbar Web Styles
 * Styled-components for Web platform
 * File: Snackbar.web.styles.jsx
 */

import styled from 'styled-components';

const getSnackbarShadow = (theme) => {
  const shadow = theme.shadows.md;
  return `${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px ${shadow.shadowRadius}px ${theme.colors.overlay.backdrop}`;
};

const StyledSnackbar = styled.div.withConfig({
  displayName: 'StyledSnackbar',
  componentId: 'StyledSnackbar',
})`
  position: fixed;
  left: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  ${({ position, theme }) => (position === 'top' ? `top: ${theme.spacing.lg}px;` : `bottom: ${theme.spacing.lg}px;`)}
  z-index: 9999;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ variant, theme }) => {
    const colors = {
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      info: theme.colors.primary,
    };
    return colors[variant] || colors.info;
  }};
  box-shadow: ${({ theme }) => getSnackbarShadow(theme)};
  min-width: ${({ theme }) => theme.spacing.xxl * 4}px;
  max-width: ${({ theme }) => theme.spacing.xxl * 12}px;
  margin: 0 auto;
  animation: slideIn ${({ theme }) => theme.animations.duration.slow}ms
    ${({ theme }) => theme.animations.easing.easeOut};
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(${({ position, theme }) => (position === 'top' ? `-${theme.spacing.lg}px` : `${theme.spacing.lg}px`)});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledSnackbarText = styled.span.withConfig({
  displayName: 'StyledSnackbarText',
  componentId: 'StyledSnackbarText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionButton = styled.button.withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  padding-left: ${({ theme }) => theme.spacing.md}px;
  padding-right: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  min-width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: none;
  background-color: ${({ theme }) => theme.colors.overlay.sheetBackdrop};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.overlay.backdrop};
  }
  
  &:focus-visible {
    outline: ${({ theme }) => theme.spacing.xs / 2}px solid ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
    outline-offset: ${({ theme }) => theme.spacing.xs / 2}px;
  }
`;

const StyledActionButtonText = styled.span.withConfig({
  displayName: 'StyledActionButtonText',
  componentId: 'StyledActionButtonText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.spacing.xs / 8}px;
`;

export { StyledSnackbar, StyledSnackbarText, StyledActionButton, StyledActionButtonText };


