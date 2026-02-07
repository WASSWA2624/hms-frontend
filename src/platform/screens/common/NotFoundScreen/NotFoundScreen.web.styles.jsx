/**
 * NotFoundScreen Web Styles
 * Styled-components for Web platform
 * File: NotFoundScreen.web.styles.jsx
 */
import styled from 'styled-components';
import { View } from 'react-native';

const StyledNotFoundContainer = styled(View).withConfig({
  displayName: 'StyledNotFoundContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
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
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
`;

const StyledMessageSection = styled(View).withConfig({
  displayName: 'StyledMessageSection',
})`
  width: 100%;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledMessageWrapper = styled(View).withConfig({
  displayName: 'StyledMessageWrapper',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledNotFoundContainer,
  StyledContent,
  StyledMessageSection,
  StyledMessageWrapper,
};

