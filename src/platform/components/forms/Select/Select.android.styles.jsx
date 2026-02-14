/**
 * Select Android Styles
 * Styled-components for Android platform
 * File: Select.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  width: 100%;
  margin-bottom: ${({ theme, $compact }) => ($compact ? theme.spacing.xs : theme.spacing.md)}px;
`;

const StyledLabelRow = styled.View.withConfig({
  displayName: 'StyledLabelRow',
  componentId: 'StyledLabelRow',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme, $compact }) => ($compact ? theme.spacing.xs : theme.spacing.xs)}px;
`;

const StyledLabel = styled.Text.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledRequired = styled.Text.withConfig({
  displayName: 'StyledRequired',
  componentId: 'StyledRequired',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.error};
`;

const StyledTrigger = styled.Pressable.withConfig({
  displayName: 'StyledTrigger',
  componentId: 'StyledTrigger',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  width: 100%;
  min-height: ${({ $compact }) => ($compact ? 40 : 44)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${({ validationState, isFocused, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme, $compact }) => ($compact ? theme.spacing.sm : theme.spacing.md)}px;
`;

const StyledTriggerText = styled.Text.withConfig({
  displayName: 'StyledTriggerText',
  componentId: 'StyledTriggerText',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme, $compact }) => ($compact ? theme.typography.fontSize.sm : theme.typography.fontSize.md)}px;
  color: ${({ disabled, isPlaceholder, theme }) => {
    if (disabled) return theme.colors.text.tertiary;
    if (isPlaceholder) return theme.colors.text.tertiary;
    return theme.colors.text.primary;
  }};
`;

const StyledChevron = styled.Text.withConfig({
  displayName: 'StyledChevron',
  componentId: 'StyledChevron',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme, $compact }) => ($compact ? theme.typography.fontSize.sm : theme.typography.fontSize.md)}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledOverlay = styled.Pressable.withConfig({
  displayName: 'StyledOverlay',
  componentId: 'StyledOverlay',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
`;

const StyledSheet = styled.View.withConfig({
  displayName: 'StyledSheet',
  componentId: 'StyledSheet',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  position: absolute;
  top: ${({ $top }) => ($top != null ? `${$top}px` : 'auto')};
  left: ${({ $left }) => ($left != null ? `${$left}px` : 'auto')};
  right: ${({ $right }) => ($right != null ? `${$right}px` : 'auto')};
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
  max-height: ${({ $maxHeight }) => ($maxHeight ? `${$maxHeight}px` : '240px')};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
`;

const StyledOptionList = styled.ScrollView.withConfig({
  displayName: 'StyledOptionList',
  componentId: 'StyledOptionList',
})`
  width: 100%;
`;

const StyledOption = styled.Pressable.withConfig({
  displayName: 'StyledOption',
  componentId: 'StyledOption',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledOptionText = styled.Text.withConfig({
  displayName: 'StyledOptionText',
  componentId: 'StyledOptionText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledHelperText = styled.Text.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ validationState, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    return theme.colors.text.secondary;
  }};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledOverlay,
  StyledSheet,
  StyledOptionList,
  StyledOption,
  StyledOptionText,
  StyledHelperText,
};


