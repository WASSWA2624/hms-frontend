/**
 * Sidebar Component Styles - Web
 * Semantic HTML; Microsoft Fluent (theme-design.mdc). Single scroll; sticky section headers.
 * File: Sidebar.web.styles.jsx
 */
import styled from 'styled-components';

const shouldNotForward = (prop) =>
  ['$collapsed', 'collapsed', 'accessibilityRole', 'accessibilityLabel', 'testID', 'footerSlot', 'items'].includes(prop);
const StyledSidebar = styled.nav.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
  shouldForwardProp: (prop) => !shouldNotForward(prop),
})`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0 ${({ theme }) => theme.radius?.sm ?? 4}px ${({ theme }) => theme.radius?.sm ?? 4}px 0;
`;

const StyledSidebarContent = styled.div.withConfig({
  displayName: 'StyledSidebarContent',
  componentId: 'StyledSidebarContent',
  shouldForwardProp: (prop) => prop !== '$collapsed',
})`
  flex: 1;
  min-height: 0;
  padding: ${({ theme, $collapsed }) => ($collapsed ? theme.spacing.xs : theme.spacing.sm)}px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSidebarSection = styled.div.withConfig({
  displayName: 'StyledSidebarSection',
  componentId: 'StyledSidebarSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSidebarSectionHeader = styled.div.withConfig({
  displayName: 'StyledSidebarSectionHeader',
  componentId: 'StyledSidebarSectionHeader',
})`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  flex-shrink: 0;
  margin: 0 -${({ theme }) => theme.spacing.xs}px;
  padding: 0 ${({ theme }) => theme.spacing.xs}px;
`;

const StyledNavItemChildren = styled.div.withConfig({
  displayName: 'StyledNavItemChildren',
  componentId: 'StyledNavItemChildren',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left: 2px solid ${({ theme }) => theme.colors.background.tertiary};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSidebarFooter = styled.div.withConfig({
  displayName: 'StyledSidebarFooter',
  componentId: 'StyledSidebarFooter',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  flex-shrink: 0;
`;

const StyledNavSection = styled.div.withConfig({
  displayName: 'StyledNavSection',
  componentId: 'StyledNavSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledNavSectionHeader = styled.div.withConfig({
  displayName: 'StyledNavSectionHeader',
  componentId: 'StyledNavSectionHeader',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const StyledNavSectionTitle = styled.span.withConfig({
  displayName: 'StyledNavSectionTitle',
  componentId: 'StyledNavSectionTitle',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledNavItem = styled.button.withConfig({
  displayName: 'StyledNavItem',
  componentId: 'StyledNavItem',
  shouldForwardProp: (prop) => !['active', 'level'].includes(prop),
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.background.secondary : 'transparent'};
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font: inherit;
  color: inherit;
  transition: background-color 0.15s ease, color 0.15s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    background-color: ${({ theme, active }) =>
      active ? theme.colors.background.secondary : theme.colors.background.tertiary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledNavItemContent = styled.div.withConfig({
  displayName: 'StyledNavItemContent',
  componentId: 'StyledNavItemContent',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNavItemLabel = styled.span.withConfig({
  displayName: 'StyledNavItemLabel',
  componentId: 'StyledNavItemLabel',
  shouldForwardProp: (prop) => prop !== 'active',
})`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, active }) =>
    active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  color: inherit;
`;

const StyledNavItemBadge = styled.span.withConfig({
  displayName: 'StyledNavItemBadge',
  componentId: 'StyledNavItemBadge',
})`
  margin-left: auto;
`;

const StyledExpandIcon = styled.span.withConfig({
  displayName: 'StyledExpandIcon',
  componentId: 'StyledExpandIcon',
  shouldForwardProp: (prop) => prop !== 'expanded',
})`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

export {
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarSection,
  StyledSidebarSectionHeader,
  StyledNavItemChildren,
  StyledSidebarFooter,
  StyledNavSection,
  StyledNavSectionHeader,
  StyledNavSectionTitle,
  StyledNavItem,
  StyledNavItemContent,
  StyledNavItemLabel,
  StyledNavItemBadge,
  StyledExpandIcon,
};
