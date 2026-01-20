/**
 * LandingScreen iOS Styles
 * Styled-components for iOS platform
 * File: LandingScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledLandingContainer = styled(View).withConfig({
  displayName: 'StyledLandingContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-top: ${({ theme }) => theme.spacing.xl * 2}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl * 2}px;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledHeroSection = styled(View).withConfig({
  displayName: 'StyledHeroSection',
})`
  width: 100%;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl * 2}px;
`;

const StyledButtonGroup = styled(View).withConfig({
  displayName: 'StyledButtonGroup',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 500px;
`;

export {
  StyledLandingContainer,
  StyledContent,
  StyledHeroSection,
  StyledButtonGroup,
};

