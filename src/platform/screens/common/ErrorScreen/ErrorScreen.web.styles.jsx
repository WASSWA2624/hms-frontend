/**
 * ErrorScreen Web Styles
 * Styled-components for Web platform
 * File: ErrorScreen.web.styles.jsx
 */
import styled from 'styled-components';
import { View, ScrollView } from 'react-native';

const StyledErrorContainer = styled(View).withConfig({
  displayName: 'StyledErrorContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
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

const StyledButtonGroup = styled(View).withConfig({
  displayName: 'StyledButtonGroup',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 400px;
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
})`
  flex: 1;
`;

const StyledScrollViewContent = styled(View).withConfig({
  displayName: 'StyledScrollViewContent',
})`
  flex-grow: 1;
`;

const StyledMessageWrapper = styled(View).withConfig({
  displayName: 'StyledMessageWrapper',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledErrorContainer,
  StyledContent,
  StyledMessageSection,
  StyledButtonGroup,
  StyledScrollView,
  StyledScrollViewContent,
  StyledMessageWrapper,
};

