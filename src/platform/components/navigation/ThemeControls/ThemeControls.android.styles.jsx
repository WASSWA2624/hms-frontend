/**
 * ThemeControls Styles - Android
 * Theme toggle (light/dark pill)
 */
import styled from 'styled-components/native';
import { View, Pressable } from 'react-native';

const StyledThemeControls = styled(View).withConfig({
  displayName: 'StyledThemeControls',
})`
  flex-direction: row;
  align-items: center;
`;

const StyledThemeToggle = styled(View).withConfig({
  displayName: 'StyledThemeToggle',
})`
  flex-direction: row;
  padding: 2px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  gap: 2px;
`;

const StyledThemeOption = styled(Pressable).withConfig({
  displayName: 'StyledThemeOption',
})`
  width: 32px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : 'transparent'};
`;

export { StyledThemeControls, StyledThemeToggle, StyledThemeOption };
