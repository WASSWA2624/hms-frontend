/**
 * ErrorState Android Styles
 * Styled-components for Android platform
 * File: ErrorState.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledErrorState = styled.View.withConfig({
  displayName: 'StyledErrorState',
  componentId: 'StyledErrorState',
})`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.status?.error?.background || theme.colors.background?.secondary};
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.error || theme.colors.status?.error?.text};
`;

const StyledIconContainer = styled.View.withConfig({
  displayName: 'StyledIconContainer',
  componentId: 'StyledIconContainer',
})`
  margin-bottom: ${({ size, theme }) => {
    const margins = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    return margins[size] || margins.medium;
  }}px;
`;

const StyledTitle = styled.Text.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.md,
      medium: theme.typography.fontSize.lg,
      large: theme.typography.fontSize.xl,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.md,
      medium: theme.typography.fontSize.lg,
      large: theme.typography.fontSize.xl,
    };
    return sizes[size] * theme.typography.lineHeight.normal || sizes.medium * theme.typography.lineHeight.normal;
  }}px;
  color: ${({ theme }) => theme.colors.status?.error?.text || theme.colors.error || theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDescription = styled.Text.withConfig({
  displayName: 'StyledDescription',
  componentId: 'StyledDescription',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };
    return sizes[size] * theme.typography.lineHeight.normal || sizes.medium * theme.typography.lineHeight.normal;
  }}px;
  color: ${({ theme }) => theme.colors.text.primary};
  opacity: 0.85;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionContainer = styled.View.withConfig({
  displayName: 'StyledActionContainer',
  componentId: 'StyledActionContainer',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  justify-content: center;
`;

export { StyledErrorState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer };

