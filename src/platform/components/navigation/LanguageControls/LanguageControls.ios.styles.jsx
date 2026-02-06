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

const StyledModalOverlay = styled(Pressable).withConfig({
  displayName: 'StyledModalOverlay',
})`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  padding: 24px;
`;

const StyledModalContent = styled(View).withConfig({
  displayName: 'StyledModalContent',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;

export { StyledLanguageControls, StyledFlagTrigger, StyledLanguageItem, StyledLanguageItemFlag, StyledModalOverlay, StyledModalContent };
