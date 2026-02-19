/**
 * Select Web Styles
 * Styled-components for Web platform
 * File: Select.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  position: relative;
  width: ${({ 'data-compact': compact }) => (compact === 'true' ? 'auto' : '100%')};
  margin-bottom: ${({ 'data-compact': compact, theme }) =>
    compact === 'true' ? 0 : theme.spacing.md}px;
`;

const StyledLabelRow = styled.div.withConfig({
  displayName: 'StyledLabelRow',
  componentId: 'StyledLabelRow',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledLabel = styled.label.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: block;
`;

const StyledRequired = styled.span.withConfig({
  displayName: 'StyledRequired',
  componentId: 'StyledRequired',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.error};
  display: inline;
`;

const StyledTrigger = styled.button.withConfig({
  displayName: 'StyledTrigger',
  componentId: 'StyledTrigger',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  width: 100%;
  min-height: ${({ 'data-compact': compact }) => (compact === 'true' ? 36 : 44)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ 'data-validation-state': validationState, 'data-focused': focused, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    if (focused === 'true') return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ 'data-compact': compact, theme }) =>
    compact === 'true' ? theme.spacing.xs : theme.spacing.md}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const StyledTriggerText = styled.span.withConfig({
  displayName: 'StyledTriggerText',
  componentId: 'StyledTriggerText',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme, 'data-compact': compact }) =>
    compact === 'true' ? theme.typography.fontSize.sm : theme.typography.fontSize.md}px;
  color: ${({ 'data-disabled': disabled, 'data-placeholder': isPlaceholder, theme }) => {
    if (disabled === 'true') return theme.colors.text.tertiary;
    if (isPlaceholder === 'true') return theme.colors.text.tertiary;
    return theme.colors.text.primary;
  }};
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledChevron = styled.span.withConfig({
  displayName: 'StyledChevron',
  componentId: 'StyledChevron',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  width: ${({ 'data-compact': compact }) => (compact === 'true' ? '16px' : '18px')};
  height: ${({ 'data-compact': compact }) => (compact === 'true' ? '16px' : '18px')};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 120ms ease-in-out;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg) translateY(-1px);
    transition: transform 120ms ease-in-out;
  }

  &[data-open='true']::before {
    transform: rotate(-135deg) translateY(-1px);
  }
`;

const StyledMenu = styled.div.withConfig({
  displayName: 'StyledMenu',
  componentId: 'StyledMenu',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  position: fixed;
  top: ${({ 'data-top': top }) => (top ? `${top}px` : 'auto')};
  left: ${({ 'data-left': left }) => (left ? `${left}px` : 'auto')};
  right: ${({ 'data-right': right }) => (right ? `${right}px` : 'auto')};
  width: ${({ 'data-width': width }) => (width ? `${width}px` : 'auto')};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
  z-index: 2000;
  overflow-x: hidden;
  max-height: ${({ 'data-max-height': maxHeight }) => (maxHeight ? `${maxHeight}px` : '240px')};
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const StyledSearchContainer = styled.div.withConfig({
  displayName: 'StyledSearchContainer',
  componentId: 'StyledSearchContainer',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledSearchInput = styled.input.withConfig({
  displayName: 'StyledSearchInput',
  componentId: 'StyledSearchInput',
})`
  width: 100%;
  min-height: 34px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
  }
`;

const StyledOption = styled.button.withConfig({
  displayName: 'StyledOption',
  componentId: 'StyledOption',
})`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: none;
  text-align: left;
  white-space: normal;
  word-break: break-word;
  line-height: 1.35;

  &:hover {
    ${({ disabled, theme }) => (disabled ? '' : `background-color: ${theme.colors.background.secondary};`)}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const StyledOptionText = styled.span.withConfig({
  displayName: 'StyledOptionText',
  componentId: 'StyledOptionText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  display: block;
  white-space: normal;
  word-break: break-word;
  line-height: 1.35;
`;

const StyledNoResults = styled.div.withConfig({
  displayName: 'StyledNoResults',
  componentId: 'StyledNoResults',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledHelperText = styled.span.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ 'data-validation-state': validationState, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    return theme.colors.text.secondary;
  }};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: block;
`;

export {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledMenu,
  StyledSearchContainer,
  StyledSearchInput,
  StyledOption,
  StyledOptionText,
  StyledNoResults,
  StyledHelperText,
};


