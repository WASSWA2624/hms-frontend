/**
 * MainLayout Web Styles
 * Styled-components for Web platform
 * File: MainLayout.web.styles.jsx
 */

import styled from 'styled-components';

const getSidebarWidth = (theme) => theme.spacing.xxl * 4 + theme.spacing.md;

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== 'testID',
}).attrs(({ testID }) => ({
  'data-testid': testID,
}))`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  min-height: ${({ theme }) => theme.spacing.xxl + theme.spacing.sm}px;
  display: flex;
  align-items: stretch;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const StyledBody = styled.div.withConfig({
  displayName: 'StyledBody',
  componentId: 'StyledBody',
})`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 0;
`;

const StyledSidebar = styled.aside.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})`
  display: none;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    display: flex;
    width: ${({ theme }) => getSidebarWidth(theme)}px;
    min-width: ${({ theme }) => getSidebarWidth(theme)}px;
  }
`;

const StyledContent = styled.section.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow-x: hidden;
`;

const StyledContentBody = styled.div.withConfig({
  displayName: 'StyledContentBody',
  componentId: 'StyledContentBody',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
`;

const StyledScreenSlot = styled.div.withConfig({
  displayName: 'StyledScreenSlot',
  componentId: 'StyledScreenSlot',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm}px;
  box-sizing: border-box;
`;

const StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  flex-shrink: 0;
`;

const StyledBreadcrumbs = styled.nav.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  box-sizing: border-box;
`;

const StyledSkipLink = styled.a.withConfig({
  displayName: 'StyledSkipLink',
  componentId: 'StyledSkipLink',
})`
  position: absolute;
  top: ${({ theme }) => -(theme.spacing.xl + theme.spacing.sm)}px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  text-decoration: none;
  z-index: 3;
  border-radius: 0 0 ${({ theme }) => theme.radius.sm}px 0;

  &:focus {
    top: 0;
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export {
  StyledContainer,
  StyledHeader,
  StyledBody,
  StyledSidebar,
  StyledContent,
  StyledContentBody,
  StyledScreenSlot,
  StyledFooter,
  StyledBreadcrumbs,
  StyledSkipLink,
};
