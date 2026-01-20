/**
 * HomeScreen Web Styles
 * Styled-components for Web platform
 * File: HomeScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledHomeContainer = styled.main.withConfig({
  displayName: 'StyledHomeContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledWelcomeSection = styled.section.withConfig({
  displayName: 'StyledWelcomeSection',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledWelcomeMessage = styled.div.withConfig({
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

