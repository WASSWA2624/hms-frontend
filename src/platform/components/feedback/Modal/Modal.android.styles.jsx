/**
 * Modal Android Styles
 * Styled-components for Android platform
 * File: Modal.android.styles.jsx
 */

import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

const StyledBackdrop = styled.View.withConfig({
  displayName: 'StyledBackdrop',
  componentId: 'StyledBackdrop',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
  justify-content: center;
  align-items: center;
`;

const StyledModalContainer = styled.View.withConfig({
  displayName: 'StyledModalContainer',
  componentId: 'StyledModalContainer',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme, size }) => (size === 'fullscreen' ? 0 : theme.radius.sm)}px;
  width: ${({ size }) => {
    const widths = {
      small: '80%',
      medium: '90%',
      large: '95%',
      fullscreen: '100%',
    };
    return widths[size] || widths.medium;
  }};
  max-width: ${({ size }) => (size === 'fullscreen' ? '100%' : '500px')};
  max-height: ${({ size }) => (size === 'fullscreen' ? '100%' : '90%')};
  ${({ size }) => (size === 'fullscreen' ? 'height: 100%;' : '')}
  overflow: hidden;
`;

const StyledCloseButton = styled.Pressable.withConfig({
  displayName: 'StyledCloseButton',
  componentId: 'StyledCloseButton',
})`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  z-index: 10;
  min-width: 44px;
  min-height: 44px;
  width: ${({ theme }) => theme.spacing.xxl}px;
  height: ${({ theme }) => theme.spacing.xxl}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledCloseButtonText = styled.Text.withConfig({
  displayName: 'StyledCloseButtonText',
  componentId: 'StyledCloseButtonText',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  line-height: ${({ theme }) => theme.typography.fontSize.xl}px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView.withConfig({
  displayName: 'StyledKeyboardAvoidingView',
  componentId: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledScrollViewContent = styled.View.withConfig({
  displayName: 'StyledScrollViewContent',
  componentId: 'StyledScrollViewContent',
  shouldForwardProp: (prop) => prop !== '$hasCloseButton',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-right: ${({ theme, $hasCloseButton }) => (
    $hasCloseButton
      ? theme.spacing.md + theme.spacing.xxl + theme.spacing.sm
      : theme.spacing.md
  )}px;
`;

const scrollContentContainerStyle = StyleSheet.create({
  content: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'stretch',
  },
}).content;

export { StyledBackdrop, StyledModalContainer, StyledCloseButton, StyledCloseButtonText, StyledKeyboardAvoidingView, StyledScrollViewContent, scrollContentContainerStyle };


