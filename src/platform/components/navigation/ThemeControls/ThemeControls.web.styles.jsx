/**
 * ThemeControls Styles - Web
 * Elegant theme toggle (light/dark pill)
 * File: ThemeControls.web.styles.jsx
 */
import styled from 'styled-components';

const StyledThemeControls = styled.div.withConfig({
  displayName: 'StyledThemeControls',
  componentId: 'StyledThemeControls',
})`
  display: inline-flex;
  align-items: center;
`;

const StyledThemeToggle = styled.div.withConfig({
  displayName: 'StyledThemeToggle',
})`
  display: inline-flex;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 2px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  gap: 2px;
`;

const StyledThemeOption = styled.button.withConfig({
  displayName: 'StyledThemeOption',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? theme.colors.text.primary : theme.colors.text.tertiary};
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: ${({ active }) => (active ? '0 1px 2px rgba(0,0,0,0.08)' : 'none')};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ active, theme }) =>
      active ? theme.colors.background.primary : theme.colors.background.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export { StyledThemeControls, StyledThemeToggle, StyledThemeOption };
