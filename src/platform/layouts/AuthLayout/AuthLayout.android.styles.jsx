/**
 * AuthLayout Android Styles
 * Styled-components for Android platform
 * File: AuthLayout.android.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView, KeyboardAvoidingView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).withConfig({
  displayName: 'StyledKeyboardAvoidingView',
  componentId: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
  width: 100%;
  justify-content: center;
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
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
  componentId: 'StyledCard',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.md * 25}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  shadow-color: ${({ theme }) => theme.shadows?.sm?.shadowColor || theme.colors.text.primary};
  shadow-offset: ${({ theme }) => theme.shadows?.sm?.shadowOffset?.width || 0}px ${({ theme }) => theme.shadows?.sm?.shadowOffset?.height || 0}px;
  shadow-opacity: ${({ theme }) => theme.shadows?.sm?.shadowOpacity || 0};
  shadow-radius: ${({ theme }) => theme.shadows?.sm?.shadowRadius || 0}px;
  elevation: ${({ theme }) => theme.shadows?.sm?.elevation || 0};
`;

const StyledBranding = styled.View.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
})`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
`;

const StyledHelpLinks = styled.View.withConfig({
  displayName: 'StyledHelpLinks',
  componentId: 'StyledHelpLinks',
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

