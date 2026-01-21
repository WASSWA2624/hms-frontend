/**
 * NetworkIndicator Styles - Web
 * File: NetworkIndicator.web.styles.jsx
 */
import styled from 'styled-components';

const StyledIndicator = styled.div.withConfig({
  displayName: 'StyledIndicator',
  componentId: 'StyledIndicator',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: transparent;
  border: none;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.xs}px`};
  }
`;

const StyledStatusDot = styled.span.withConfig({
  displayName: 'StyledStatusDot',
  componentId: 'StyledStatusDot',
})`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme, status }) => {
    if (status === 'offline') return theme.colors.error;
    if (status === 'unstable') return theme.colors.warning;
    if (status === 'syncing') return theme.colors.secondary;
    return theme.colors.success;
  }};
  flex: 0 0 auto;
`;

export { StyledIndicator, StyledStatusDot };
