/**
 * ThemeToggle Styles - Android
 * Single-position theme toggle (light/dark)
 * File: ThemeToggle.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable } from 'react-native';

const StyledThemeToggleWrapper = styled(View).withConfig({
  displayName: 'StyledThemeToggleWrapper',
  componentId: 'StyledThemeToggleWrapper',
})`
  flex-direction: row;
  align-items: center;
`;

const StyledThemeToggleTrack = styled(View).withConfig({
  displayName: 'StyledThemeToggleTrack',
  componentId: 'StyledThemeToggleTrack',
})`
  flex-direction: row;
  padding: 2px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledThemeToggleButton = styled(Pressable).withConfig({
  displayName: 'StyledThemeToggleButton',
  componentId: 'StyledThemeToggleButton',
})`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export { StyledThemeToggleWrapper, StyledThemeToggleTrack, StyledThemeToggleButton };
