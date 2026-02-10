/**
 * SearchBar Web Styles
 * Styled-components for Web; Microsoft Fluent / M365 look
 * File: SearchBar.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.full}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  box-shadow: ${({ theme }) =>
    theme.mode === 'dark'
      ? '0 10px 24px rgba(0, 0, 0, 0.35)'
      : '0 10px 24px rgba(15, 23, 42, 0.08)'};
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}33`},
      ${({ theme }) =>
    theme.mode === 'dark'
      ? '0 10px 24px rgba(0, 0, 0, 0.45)'
      : '0 10px 24px rgba(15, 23, 42, 0.12)'};
    outline: none;
  }
`;

const StyledInput = styled.input.withConfig({
  displayName: 'StyledInput',
  componentId: 'StyledInput',
})`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 4px 8px 4px 0;
  line-height: 1.3;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  &::-ms-clear {
    display: none;
  }
`;

const StyledSearchButton = styled.button.withConfig({
  displayName: 'StyledSearchButton',
  componentId: 'StyledSearchButton',
})`
  width: ${({ theme }) => theme.spacing.lg + theme.spacing.xs * 2}px;
  height: ${({ theme }) => theme.spacing.lg + theme.spacing.xs * 2}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: none;
  padding: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.98);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}33`},
      0 8px 16px rgba(0, 0, 0, 0.22);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    filter: none;
    transform: none;
  }
`;

const StyledSearchIcon = styled.svg.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const StyledClearButton = styled.button.withConfig({
  displayName: 'StyledClearButton',
  componentId: 'StyledClearButton',
})`
  width: ${({ theme }) => theme.spacing.lg}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: none;
  padding: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const StyledClearIcon = styled.svg.withConfig({
  displayName: 'StyledClearIcon',
  componentId: 'StyledClearIcon',
})`
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export {
  StyledClearButton,
  StyledClearIcon,
  StyledContainer,
  StyledInput,
  StyledSearchButton,
  StyledSearchIcon,
};
