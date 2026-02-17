/**
 * ErrorState Web Styles
 * Styled-components for Web platform
 * File: ErrorState.web.styles.jsx
 */

import styled from 'styled-components';

const getErrorIconShadow = (theme) => {
  const shadow = theme.shadows.sm;
  return `${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px ${shadow.shadowRadius}px ${theme.colors.overlay.backdrop}`;
};

const StyledErrorState = styled.div.withConfig({
  displayName: 'StyledErrorState',
  componentId: 'StyledErrorState',
})`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ size, theme }) => {
    const paddings = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return paddings[size] || paddings.medium;
  }}px;
  background-color: ${({ theme }) => theme.colors.status?.error?.background || theme.colors.background?.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left: ${({ theme }) => theme.spacing.xs}px solid ${({ theme }) => theme.colors.error || theme.colors.status?.error?.text};
`;

const StyledIconContainer = styled.div.withConfig({
  displayName: 'StyledIconContainer',
  componentId: 'StyledIconContainer',
})`
  margin-bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ size, theme }) => {
    const sizes = {
      small: theme.spacing.lg,
      medium: theme.spacing.xl,
      large: theme.spacing.xxl,
    };
    return sizes[size] || sizes.medium;
  }}px;
  height: ${({ size, theme }) => {
    const sizes = {
      small: theme.spacing.lg,
      medium: theme.spacing.xl,
      large: theme.spacing.xxl,
    };
    return sizes[size] || sizes.medium;
  }}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: ${({ theme }) => theme.spacing.xs / 4}px solid ${({ theme }) => theme.colors.error || theme.colors.status?.error?.text};
  box-shadow: ${({ theme }) => getErrorIconShadow(theme)};
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.error || theme.colors.status?.error?.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledTitle = styled.h2.withConfig({
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
  margin: 0;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const StyledHeaderRow = styled.div.withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'StyledHeaderRow',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  max-width: 100%;
  min-width: 0;
  flex-wrap: wrap;
  text-align: center;
`;

const StyledDescription = styled.p.withConfig({
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
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.sm}px 0;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const StyledActionContainer = styled.div.withConfig({
  displayName: 'StyledActionContainer',
  componentId: 'StyledActionContainer',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export { StyledErrorState, StyledIconContainer, StyledTitle, StyledHeaderRow, StyledDescription, StyledActionContainer };

