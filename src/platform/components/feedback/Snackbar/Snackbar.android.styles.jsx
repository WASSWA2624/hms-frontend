/**
 * Snackbar Android Styles
 * Styled-components for Android platform
 * File: Snackbar.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledSnackbar = styled.View.withConfig({
  displayName: 'StyledSnackbar',
  componentId: 'StyledSnackbar',
})`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  ${({ position, theme }) => (position === 'top' ? `top: ${theme.spacing.lg}px;` : `bottom: ${theme.spacing.lg}px;`)}
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
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
  elevation: ${({ theme }) => theme.shadows.md.elevation};
  min-width: ${({ theme }) => theme.spacing.xxl * 4}px;
  max-width: 100%;
`;

const StyledSnackbarText = styled.Text.withConfig({
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

const StyledActionButton = styled.Pressable.withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  min-width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.overlay.sheetBackdrop};
`;

const StyledActionButtonText = styled.Text.withConfig({
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


