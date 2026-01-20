/**
 * AuthLayout iOS Styles
 * Styled-components for iOS platform
 * File: AuthLayout.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView, KeyboardAvoidingView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).withConfig({
  displayName: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
  width: 100%;
  justify-content: center;
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
}).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
})`
  flex: 1;
  width: 100%;
`;

const StyledCard = styled.View.withConfig({
  displayName: 'StyledCard',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.md * 25}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  shadow-color: ${({ theme }) => theme.shadows?.md?.shadowColor || theme.colors.text.primary};
  shadow-offset: ${({ theme }) => theme.shadows?.md?.shadowOffset?.width || 0}px ${({ theme }) => theme.shadows?.md?.shadowOffset?.height || 0}px;
  shadow-opacity: ${({ theme }) => theme.shadows?.md?.shadowOpacity || 0};
  shadow-radius: ${({ theme }) => theme.shadows?.md?.shadowRadius || 0}px;
  elevation: ${({ theme }) => theme.shadows?.md?.elevation || 0};
`;

const StyledBranding = styled.View.withConfig({
  displayName: 'StyledBranding',
})`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
})`
  width: 100%;
`;

const StyledHelpLinks = styled.View.withConfig({
  displayName: 'StyledHelpLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
`;

export {
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledScrollView,
  StyledCard,
  StyledBranding,
  StyledContent,
  StyledHelpLinks,
};

