/**
 * ErrorScreen iOS Styles
 * Styled-components for iOS platform
 * File: ErrorScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View, ScrollView } from 'react-native';

const StyledErrorContainer = styled(View).withConfig({
  displayName: 'StyledErrorContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-top: ${({ theme }) => theme.spacing.xl * 2}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl * 2}px;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
  justify-content: center;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 560px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledMessageSection = styled(View).withConfig({
  displayName: 'StyledMessageSection',
})`
  width: 100%;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
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
  align-items: center;
  justify-content: center;
`;

const StyledMessageWrapper = styled(View).withConfig({
  displayName: 'StyledMessageWrapper',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  max-width: 520px;
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

