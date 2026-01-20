/**
 * LandingScreen Web Styles
 * Styled-components for Web platform
 * File: LandingScreen.web.styles.jsx
 */
import styled from 'styled-components';
import { View } from 'react-native';

const StyledLandingContainer = styled(View).withConfig({
  displayName: 'StyledLandingContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => {
    if (!theme || !theme.colors || !theme.colors.background) {
      return '#FFFFFF'; // fallback
    }
    return theme.colors.background.primary;
  }};
  padding-top: ${({ theme }) => (theme?.spacing?.xl ?? 32) * 2}px;
  padding-bottom: ${({ theme }) => (theme?.spacing?.xl ?? 32) * 2}px;
  padding-left: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  padding-right: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
`;

const StyledHeroSection = styled(View).withConfig({
  displayName: 'StyledHeroSection',
})`
  width: 100%;
  align-items: center;
  margin-bottom: ${({ theme }) => (theme?.spacing?.xl ?? 32) * 2}px;
`;

const StyledButtonGroup = styled(View).withConfig({
  displayName: 'StyledButtonGroup',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme?.spacing?.md ?? 16}px;
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

