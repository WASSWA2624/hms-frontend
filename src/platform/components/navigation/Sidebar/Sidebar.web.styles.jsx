/**
 * Sidebar Component Styles - Web
 * Styled-components for Sidebar web implementation
 * File: Sidebar.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Pressable, Text } from 'react-native';

const StyledSidebar = styled(View).withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledSidebarContent = styled(View).withConfig({
  displayName: 'StyledSidebarContent',
  componentId: 'StyledSidebarContent',
})`
  flex: 1;
  min-height: 0;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledSidebarFooter = styled(View).withConfig({
  displayName: 'StyledSidebarFooter',
  componentId: 'StyledSidebarFooter',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-shrink: 0;
`;

const StyledNavSection = styled(View).withConfig({
  displayName: 'StyledNavSection',
  componentId: 'StyledNavSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledNavSectionHeader = styled(View).withConfig({
  displayName: 'StyledNavSectionHeader',
  componentId: 'StyledNavSectionHeader',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledNavSectionTitle = styled(Text).withConfig({
  displayName: 'StyledNavSectionTitle',
  componentId: 'StyledNavSectionTitle',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledNavItem = styled(Pressable).withConfig({
  displayName: 'StyledNavItem',
  componentId: 'StyledNavItem',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.background.secondary : 'transparent'};
  flex-direction: row;
  align-items: center;
  min-height: 44px;
  padding-left: ${({ theme, level }) => theme.spacing.md + level * theme.spacing.md}px;

  &:hover {
    background-color: ${({ theme, active }) =>
      active ? theme.colors.background.secondary : theme.colors.background.tertiary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

const StyledNavItemContent = styled(View).withConfig({
  displayName: 'StyledNavItemContent',
  componentId: 'StyledNavItemContent',
})`
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNavItemLabel = styled(Text).withConfig({
  displayName: 'StyledNavItemLabel',
  componentId: 'StyledNavItemLabel',
})`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme, active }) => (active ? '600' : theme.typography.fontWeight.normal)};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.primary};
`;

const StyledNavItemBadge = styled(View).withConfig({
  displayName: 'StyledNavItemBadge',
  componentId: 'StyledNavItemBadge',
})`
  margin-left: auto;
`;

const StyledNavItemChildren = styled(View).withConfig({
  displayName: 'StyledNavItemChildren',
  componentId: 'StyledNavItemChildren',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const StyledExpandIcon = styled(Text).withConfig({
  displayName: 'StyledExpandIcon',
  componentId: 'StyledExpandIcon',
})`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

export {
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarFooter,
  StyledNavSection,
  StyledNavSectionHeader,
  StyledNavSectionTitle,
  StyledNavItem,
  StyledNavItemContent,
  StyledNavItemLabel,
  StyledNavItemBadge,
  StyledNavItemChildren,
  StyledExpandIcon,
};

