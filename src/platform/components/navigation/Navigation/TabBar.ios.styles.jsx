/**
 * TabBar Component Styles - iOS
 * Styled-components for TabBar iOS implementation
 * File: TabBar.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable, Text } from 'react-native';

const StyledTabBar = styled(View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  padding-bottom: ${({ theme }) => theme.spacing.md + 20}px;
  shadow-color: ${({ theme }) => theme.colors.text.primary};
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const StyledTabBarContent = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
`;

const StyledTabItem = styled(Pressable)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-height: 56px;
  position: relative;
`;

const StyledTabItemIcon = styled(Text)`
  font-size: 24px;
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTabItemLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, active }) => (active ? '600' : theme.typography.fontWeight.normal)};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.tertiary};
  text-align: center;
`;

const StyledTabItemBadge = styled(View)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xs}px;
  right: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledTabBar,
  StyledTabBarContent,
  StyledTabItem,
  StyledTabItemIcon,
  StyledTabItemLabel,
  StyledTabItemBadge,
};


