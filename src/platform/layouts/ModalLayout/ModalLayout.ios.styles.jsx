/**
 * ModalLayout iOS Styles
 * Styled-components for iOS platform
 * File: ModalLayout.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView, KeyboardAvoidingView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).withConfig({
  displayName: 'StyledKeyboardAvoidingView',
  componentId: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
}).attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})`
  flex: 1;
`;

export {
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledScrollView,
};


