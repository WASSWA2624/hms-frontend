/**
 * HomeScreen iOS Styles
 * Styled-components for iOS platform
 * File: HomeScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledHomeContainer = styled(View).withConfig({
  displayName: 'StyledHomeContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
})`
  flex: 1;
  width: 100%;
`;

const StyledWelcomeSection = styled(View).withConfig({
  displayName: 'StyledWelcomeSection',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledWelcomeMessage = styled(View).withConfig({
  displayName: 'StyledWelcomeMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledHomeContainer,
  StyledContent,
  StyledWelcomeSection,
  StyledWelcomeMessage,
};

