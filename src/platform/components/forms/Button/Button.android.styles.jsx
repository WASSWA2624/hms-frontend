/**
 * BUTTON Android Styles
 * Styled-components for Android platform
 * File: Button.android.styles.jsx
 */
import styled from 'styled-components/native';


// Module-level cache to prevent recreation during HMR
// This ensures styled components persist across hot module reloads
// Use globalThis for cross-platform compatibility (Node, web, etc.)
const globalObj = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
const componentCache = (globalObj.__BUTTON_STYLES__ = globalObj.__BUTTON_STYLES__ || {});
const StyledButton = componentCache.StyledButton || (componentCache.StyledButton = styled.Pressable.withConfig({
  displayName: 'StyledButton',
  componentId: 'StyledButton',
}))`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: ${({ size, theme, variant }) => {
    const heights = {
      small: 44,
      medium: 48,
      large: 56,
    };
    const surfaceHeights = {
      small: 32,
      medium: 36,
      large: 40,
    };
    const resolved = variant === 'surface' ? surfaceHeights : heights;
    return resolved[size] || resolved.medium;
  }}px;
  padding-left: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    const surfacePadding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  padding-right: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    const surfacePadding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  padding-top: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const surfacePadding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  padding-bottom: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const surfacePadding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ variant, state, theme }) => {
    if (state === 'disabled') {
      return variant === 'text' ? 'transparent' : theme.colors.background.tertiary;
    }
    if (state === 'loading') {
      return variant === 'text' ? 'transparent' : theme.colors.primary;
    }
    if (variant === 'primary') {
      return state === 'active' ? theme.colors.primary : theme.colors.primary;
    }
    if (variant === 'secondary') {
      return state === 'active' ? theme.colors.secondary : theme.colors.secondary;
    }
    if (variant === 'outline') {
      return 'transparent';
    }
    if (variant === 'surface') {
      return theme.colors.background.secondary;
    }
    return 'transparent';
  }};
  border-width: ${({ variant }) => (variant === 'outline' || variant === 'surface' ? 1 : 0)}px;
  border-color: ${({ variant, state, theme }) => {
    if (variant === 'outline') {
      if (state === 'disabled') return theme.colors.background.tertiary;
      return theme.colors.primary;
    }
    if (variant === 'surface') {
      return theme.colors.background.tertiary;
    }
    return 'transparent';
  }};
  opacity: ${({ state }) => (state === 'disabled' ? 0.5 : 1)};
`;

const StyledButtonText = componentCache.StyledButtonText || (componentCache.StyledButtonText = styled.Text.withConfig({
  displayName: 'StyledButtonText',
  componentId: 'StyledButtonText',
}))`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ size, theme, variant }) => {
    if (variant === 'surface') {
      return theme.typography.fontSize.xs;
    }
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ size, theme, variant }) => {
    if (variant === 'surface') {
      return theme.typography.fontSize.xs * theme.typography.lineHeight.normal;
    }
    const lineHeights = {
      small: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      medium: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      large: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    };
    return lineHeights[size] || lineHeights.medium;
  }}px;
  color: ${({ variant, state, theme }) => {
    if (state === 'disabled') {
      return theme.colors.text.tertiary;
    }
    if (variant === 'primary' || variant === 'secondary') {
      return theme.colors.text.inverse;
    }
    if (variant === 'outline') {
      return state === 'active' ? theme.colors.primary : theme.colors.primary;
    }
    if (variant === 'surface') {
      return theme.colors.text.primary;
    }
    return theme.colors.primary;
  }};
  margin-left: ${({ hasIcon, theme }) => (hasIcon ? theme.spacing.xs : 0)}px;
`;

const StyledButtonContent = componentCache.StyledButtonContent || (componentCache.StyledButtonContent = styled.View.withConfig({
  displayName: 'StyledButtonContent',
  componentId: 'StyledButtonContent',
}))`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledSpinner = styled.ActivityIndicator.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
}).attrs(({ color }) => ({
  color: color,
}))`
  margin-right: ${({ hasText, theme }) => (hasText ? theme.spacing.xs : 0)}px;
`;

export { StyledButton, StyledButtonText, StyledButtonContent, StyledSpinner };
