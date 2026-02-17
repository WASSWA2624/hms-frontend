/**
 * LanguageControls Styles - iOS
 * Flag button + modal list
 */
import styled from 'styled-components/native';
import { View, Pressable, Text } from 'react-native';

const StyledLanguageControls = styled(View).withConfig({
  displayName: 'StyledLanguageControls',
})`
  flex-direction: row;
  align-items: center;
`;

const StyledFlagTrigger = styled(Pressable).withConfig({
  displayName: 'StyledFlagTrigger',
})`
  min-width: 36px;
  height: 28px;
  padding: 0 6px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: transparent;
`;

const StyledFlagGlyph = styled(Text).withConfig({
  displayName: 'StyledFlagGlyph',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledLanguageItem = styled(Pressable).withConfig({
  displayName: 'StyledLanguageItem',
})`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledLanguageItemFlag = styled(Text).withConfig({
  displayName: 'StyledLanguageItemFlag',
})`
  font-size: 20px;
`;

const StyledModalRoot = styled(View).withConfig({
  displayName: 'StyledModalRoot',
})`
  flex: 1;
`;

const StyledModalOverlay = styled(Pressable).withConfig({
  displayName: 'StyledModalOverlay',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
`;

const StyledModalStage = styled(View).withConfig({
  displayName: 'StyledModalStage',
}).attrs({
  pointerEvents: 'box-none',
})`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledModalContent = styled(View).withConfig({
  displayName: 'StyledModalContent',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;

export {
  StyledFlagGlyph,
  StyledFlagTrigger,
  StyledLanguageControls,
  StyledLanguageItem,
  StyledLanguageItemFlag,
  StyledModalContent,
  StyledModalOverlay,
  StyledModalRoot,
  StyledModalStage,
};
