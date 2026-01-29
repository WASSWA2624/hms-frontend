/**
 * GlobalHeader Component Styles - Web
 * Styled-components for GlobalHeader web implementation
 * File: GlobalHeader.web.styles.jsx
 */
import styled from 'styled-components';

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  min-height: 56px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledHeaderRow = styled.div.withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'StyledHeaderRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
  flex-wrap: nowrap;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    gap: ${({ theme }) => theme.spacing.sm}px;
  }
`;

const StyledLeadingSlot = styled.div.withConfig({
  displayName: 'StyledLeadingSlot',
  componentId: 'StyledLeadingSlot',
})`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
`;

const StyledTitleGroup = styled.div.withConfig({
  displayName: 'StyledTitleGroup',
  componentId: 'StyledTitleGroup',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  flex: 1;
  min-width: 0;
  flex-wrap: nowrap;
  overflow: visible;
`;

const StyledTitleBlock = styled.div.withConfig({
  displayName: 'StyledTitleBlock',
  componentId: 'StyledTitleBlock',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
  overflow: hidden;
`;

const StyledActionsGroup = styled.div.withConfig({
  displayName: 'StyledActionsGroup',
  componentId: 'StyledActionsGroup',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const StyledUtilityGroup = styled.div.withConfig({
  displayName: 'StyledUtilityGroup',
  componentId: 'StyledUtilityGroup',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const StyledActionButton = styled.button.withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: 0 ${({ theme }) => theme.spacing.sm}px;
  min-height: 40px;
  min-width: 40px;
  border-radius: ${({ theme, isCircular }) =>
    isCircular ? theme.radius.full : theme.radius.md}px;
  border: 1px solid
    ${({ theme, isPrimary }) => (isPrimary ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, isPrimary }) =>
    isPrimary ? theme.colors.primary : theme.colors.background.secondary};
  color: ${({ theme, isPrimary }) => (isPrimary ? theme.colors.text.inverse : theme.colors.text.secondary)};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
  transition: background-color 0.2s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;

  &:hover {
    background-color: ${({ theme, isPrimary }) =>
      isPrimary ? theme.colors.primary : theme.colors.background.tertiary};
    color: ${({ theme, isPrimary }) => (isPrimary ? theme.colors.text.inverse : theme.colors.text.primary)};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    min-height: ${({ theme }) => theme.spacing.xxl}px;
    min-width: ${({ theme }) => theme.spacing.xxl}px;
    padding: 0;
    background-color: transparent;
    border: 1px solid
      ${({ theme, isPrimary }) => (isPrimary ? theme.colors.primary : theme.colors.background.tertiary)};
  }
`;

const StyledActionIcon = styled.span.withConfig({
  displayName: 'StyledActionIcon',
  componentId: 'StyledActionIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
`;

const StyledBreadcrumbsRow = styled.nav.withConfig({
  displayName: 'StyledBreadcrumbsRow',
  componentId: 'StyledBreadcrumbsRow',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  width: 100%;
`;

export {
  StyledHeader,
  StyledHeaderRow,
  StyledLeadingSlot,
  StyledTitleGroup,
  StyledTitleBlock,
  StyledActionsGroup,
  StyledUtilityGroup,
  StyledActionButton,
  StyledActionIcon,
  StyledBreadcrumbsRow,
};
