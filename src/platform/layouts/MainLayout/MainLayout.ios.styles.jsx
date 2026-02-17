/**
 * MainLayout iOS Styles
 * Styled-components for iOS platform
 * File: MainLayout.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  min-height: ${({ theme }) => theme.spacing.sm * 7}px;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
}).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'stretch',
  },
})`
  flex: 1;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  padding: 0;
`;

const StyledScreenSlot = styled.View.withConfig({
  displayName: 'StyledScreenSlot',
  componentId: 'StyledScreenSlot',
})`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFooter = styled.View.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`;

const StyledBreadcrumbs = styled.View.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  align-self: stretch;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs / 2}px;
`;

export {
  StyledContainer,
  StyledHeader,
  StyledScrollView,
  StyledContent,
  StyledScreenSlot,
  StyledFooter,
  StyledBreadcrumbs,
};


