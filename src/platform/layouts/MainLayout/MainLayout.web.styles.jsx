/**
 * MainLayout Web Styles
 * Styled-components for Web platform
 * File: MainLayout.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  min-height: ${({ theme }) => theme.spacing.sm * 7}px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const StyledBody = styled.div.withConfig({
  displayName: 'StyledBody',
  componentId: 'StyledBody',
})`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
`;

const StyledSidebar = styled.aside.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})`
  display: none;
  width: 200px;
  min-width: 200px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    display: flex;
  }
`;

const StyledContent = styled.main.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xs}px;
  max-width: 100%;
  margin: 0;
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
`;

const StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-top: auto;
  flex-shrink: 0;
`;

const StyledBreadcrumbs = styled.nav.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const StyledSkipLink = styled.a.withConfig({
  displayName: 'StyledSkipLink',
  componentId: 'StyledSkipLink',
})`
  position: absolute;
  top: ${({ theme }) => -theme.spacing.xl - theme.spacing.sm}px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing.xs}px;
  text-decoration: none;
  z-index: 1000;
  border-radius: 0 0 ${({ theme }) => theme.radius.sm}px 0;

  &:focus {
    top: 0;
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
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
  StyledFooter,
  StyledBreadcrumbs,
  StyledSkipLink,
};
