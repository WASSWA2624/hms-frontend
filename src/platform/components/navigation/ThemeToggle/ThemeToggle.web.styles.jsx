/**
 * ThemeToggle Styles - Web
 * Single-position theme toggle (light/dark)
 * File: ThemeToggle.web.styles.jsx
 */
import styled from 'styled-components';

const StyledThemeToggleWrapper = styled.div.withConfig({
  displayName: 'StyledThemeToggleWrapper',
  componentId: 'StyledThemeToggleWrapper',
})`
  display: inline-flex;
  align-items: center;
`;

const StyledThemeToggleTrack = styled.div.withConfig({
  displayName: 'StyledThemeToggleTrack',
  componentId: 'StyledThemeToggleTrack',
})`
  display: inline-flex;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 2px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledThemeToggleButton = styled.button.withConfig({
  displayName: 'StyledThemeToggleButton',
  componentId: 'StyledThemeToggleButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export { StyledThemeToggleWrapper, StyledThemeToggleTrack, StyledThemeToggleButton };
