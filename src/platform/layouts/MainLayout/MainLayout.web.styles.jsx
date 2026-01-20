/**
 * MAINLAYOUT Web Styles
 * Styled-components for Web platform
 * File: MainLayout.web.styles.jsx
 */
import styled from 'styled-components';


// Module-level cache to prevent recreation during HMR
// This ensures styled components persist across hot module reloads
// Use globalThis for cross-platform compatibility (Node, web, etc.)
const globalObj = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
const componentCache = (globalObj.__MAINLAYOUT_STYLES__ = globalObj.__MAINLAYOUT_STYLES__ || {});

const StyledContainer = componentCache.StyledContainer || (componentCache.StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
})`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`);

const StyledHeader = componentCache.StyledHeader || (componentCache.StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  min-height: ${({ theme }) => theme.spacing.sm * 7}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`);

const StyledBody = componentCache.StyledBody || (componentCache.StyledBody = styled.div.withConfig({
  displayName: 'StyledBody',
})`
  display: flex;
  flex-direction: row;
  flex: 1;
`);

const StyledSidebar = componentCache.StyledSidebar || (componentCache.StyledSidebar = styled.aside.withConfig({
  displayName: 'StyledSidebar',
})`
  display: none;
  width: ${({ theme }) => theme.spacing.md * 15}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px;
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    display: block;
  }
`);

const StyledContent = componentCache.StyledContent || (componentCache.StyledContent = styled.main.withConfig({
  displayName: 'StyledContent',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
  max-width: ${({ theme, hasSidebar }) => (hasSidebar ? `calc(100% - ${theme.spacing.md * 15}px)` : `${theme.spacing.md * 75}px`)};
  margin: 0 auto;
  width: 100%;
`);

const StyledFooter = componentCache.StyledFooter || (componentCache.StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-top: auto;
`);

const StyledBreadcrumbs = componentCache.StyledBreadcrumbs || (componentCache.StyledBreadcrumbs = styled.nav.withConfig({
  displayName: 'StyledBreadcrumbs',
})`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`);

const StyledSkipLink = componentCache.StyledSkipLink || (componentCache.StyledSkipLink = styled.a.withConfig({
  displayName: 'StyledSkipLink',
})`
  position: absolute;
  top: ${({ theme }) => -theme.spacing.xl - theme.spacing.sm}px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing.xs}px;
  text-decoration: none;
  z-index: 1000;

  &:focus {
    top: 0;
  }
`);

export {
  StyledContainer,
  StyledHeader,
  StyledBody,
  StyledSidebar,
  StyledContent,
  StyledFooter,
  StyledBreadcrumbs,
  StyledSkipLink,
};
