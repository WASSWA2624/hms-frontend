/**
 * AppFrame iOS Styles
 * Styled-components for iOS platform
 * File: AppFrame.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: transparent;
  border-bottom-width: 0;
  padding: 0;
  flex-direction: column;
  align-items: stretch;
`;

const StyledBanner = styled.View.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
`;

const StyledBreadcrumbs = styled.View.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  align-self: stretch;
  width: 100%;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
  shouldForwardProp: (prop) => prop !== '$footerInset',
}).attrs(({ theme, $footerInset }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingBottom: $footerInset ? theme.spacing.xxl * 2 : 0,
  },
}))`
  flex: 1;
`;

const StyledSidebar = styled.View.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  align-self: stretch;
  width: 100%;
  padding: 0;
`;

const StyledScreenSlot = styled.View.withConfig({
  displayName: 'StyledScreenSlot',
  componentId: 'StyledScreenSlot',
})`
  flex: 1;
  align-self: stretch;
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

const StyledOverlay = styled.View.withConfig({
  displayName: 'StyledOverlay',
  componentId: 'StyledOverlay',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
`;

export {
  StyledBanner,
  StyledBreadcrumbs,
  StyledContainer,
  StyledContent,
  StyledScreenSlot,
  StyledFooter,
  StyledHeader,
  StyledOverlay,
  StyledScrollView,
  StyledSidebar,
};
