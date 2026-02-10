/**
 * Switch Web Styles
 * Styled-components for Web platform
 * File: Switch.web.styles.jsx
 */

import styled from 'styled-components';

const StyledSwitch = styled.label.withConfig({
  displayName: 'StyledSwitch',
  componentId: 'StyledSwitch',
})`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  gap: ${({ theme }) => theme.spacing.sm}px;
  user-select: none;

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.full}px;
  }
`;

const StyledSwitchInput = styled.input.withConfig({
  displayName: 'StyledSwitchInput',
  componentId: 'StyledSwitchInput',
})`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  pointer-events: none;
`;

const StyledSwitchTrack = styled.span.withConfig({
  displayName: 'StyledSwitchTrack',
  componentId: 'StyledSwitchTrack',
})`
  width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ value, disabled, theme }) => {
    if (disabled) return theme.colors.background.tertiary;
    return value ? theme.colors.primary : theme.colors.background.tertiary;
  }};
  padding: ${({ theme }) => theme.spacing.xs / 2}px;
  transition: background-color 0.2s ease;
  display: inline-flex;
  align-items: center;
`;

const StyledSwitchThumb = styled.span.withConfig({
  displayName: 'StyledSwitchThumb',
  componentId: 'StyledSwitchThumb',
})`
  width: ${({ theme }) => theme.spacing.lg - theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.lg - theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  transform: translateX(
    ${({ value, theme }) => (value ? theme.spacing.xxl - theme.spacing.xs - theme.spacing.lg : 0)}px
  );
  transition: transform 0.2s ease;
`;

const StyledSwitchLabel = styled.span.withConfig({
  displayName: 'StyledSwitchLabel',
  componentId: 'StyledSwitchLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: 400;
  line-height: ${({ theme }) =>
    theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.text.tertiary : theme.colors.text.primary};
`;

export { StyledSwitch, StyledSwitchInput, StyledSwitchTrack, StyledSwitchThumb, StyledSwitchLabel };


