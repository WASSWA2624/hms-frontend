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
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
    outline: none;
  }
`;

const StyledSearchIcon = styled.span.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const StyledTextFieldWrapper = styled.div.withConfig({
  displayName: 'StyledTextFieldWrapper',
  componentId: 'StyledTextFieldWrapper',
})`
  flex: 1;
  min-width: 0;
`;

export {
  StyledContainer,
  StyledSearchIcon,
  StyledTextFieldWrapper,
};
