/**
 * SettingsScreen iOS Styles
 * Per component-structure.mdc: withConfig displayName + componentId
 */
import styled from 'styled-components/native';

const borderColor = ({ theme }) => theme?.colors?.border?.light ?? '#e5e5ea';
const primaryColor = ({ theme }) => theme?.colors?.primary ?? '#0066cc';

export const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'SettingsScreen_StyledContainer',
})`
  flex: 1;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const StyledSidebar = styled.ScrollView.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'SettingsScreen_StyledSidebar',
})`
  width: 200px;
  min-width: 160px;
  border-right-width: 1px;
  border-right-color: ${borderColor};
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
`;

export const StyledSidebarTitle = styled.Text.withConfig({
  displayName: 'StyledSidebarTitle',
  componentId: 'SettingsScreen_StyledSidebarTitle',
})`
  margin-horizontal: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StyledNavItem = styled.View.withConfig({
  displayName: 'StyledNavItem',
  componentId: 'SettingsScreen_StyledNavItem',
})`
  margin: 0;
`;

export const StyledNavLink = styled.Pressable.withConfig({
  displayName: 'StyledNavLink',
  componentId: 'SettingsScreen_StyledNavLink',
})`
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  border-left-width: 3px;
  border-left-color: ${({ $active, theme }) => ($active ? primaryColor({ theme }) : 'transparent')};
  background-color: ${({ $active, theme }) =>
    $active ? (theme?.colors?.background?.secondary ?? '#f2f2f7') : 'transparent'};
`;

export const StyledNavLinkText = styled.Text.withConfig({
  displayName: 'StyledNavLinkText',
  componentId: 'SettingsScreen_StyledNavLinkText',
})`
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active, theme }) =>
    $active ? (theme?.colors?.primary ?? '#0066cc') : theme?.colors?.text?.secondary};
`;

