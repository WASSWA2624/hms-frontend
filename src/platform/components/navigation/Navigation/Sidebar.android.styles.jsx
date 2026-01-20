/**
 * Sidebar Component Styles - Android
 * Styled-components for Sidebar Android implementation
 * File: Sidebar.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable, Text } from 'react-native';

const StyledSidebar = styled(View)`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-right-width: 1px;
  border-right-color: ${({ theme }) => theme.colors.background.tertiary};
  height: 100%;
  elevation: 4;
`;

const StyledSidebarContent = styled(View)`
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNavSection = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledNavSectionHeader = styled(View)`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledNavSectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledNavItem = styled(Pressable)`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.background.secondary : 'transparent'};
  flex-direction: row;
  align-items: center;
  min-height: 48px;
  padding-left: ${({ theme, level }) => theme.spacing.md + level * theme.spacing.md}px;
`;

const StyledNavItemContent = styled(View)`
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNavItemIcon = styled(Text)`
  font-size: 20px;
  min-width: 24px;
  text-align: center;
`;

const StyledNavItemLabel = styled(Text)`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme, active }) => (active ? '600' : theme.typography.fontWeight.normal)};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.primary};
`;

const StyledNavItemBadge = styled(View)`
  margin-left: auto;
`;

const StyledNavItemChildren = styled(View)`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const StyledExpandIcon = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export {
  StyledSidebar,
  StyledSidebarContent,
  StyledNavSection,
  StyledNavSectionHeader,
  StyledNavSectionTitle,
  StyledNavItem,
  StyledNavItemContent,
  StyledNavItemIcon,
  StyledNavItemLabel,
  StyledNavItemBadge,
  StyledNavItemChildren,
  StyledExpandIcon,
};


