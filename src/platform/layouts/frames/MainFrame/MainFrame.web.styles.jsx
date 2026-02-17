/**
 * MainFrame Web Styles
 * Responsive; theme tokens; Fluent (subtle radius, light borders)
 * File: MainFrame.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== 'testID',
}).attrs(({ testID }) => ({
  'data-testid': testID,
}))`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const StyledContent = styled.main.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
  shouldForwardProp: (prop) => prop !== 'hasFooter',
})`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ hasFooter, theme }) => (hasFooter ? `${theme.spacing.xl}px` : '0')};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    padding: ${({ theme }) => theme.spacing.lg}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    padding: ${({ theme }) => theme.spacing.xl}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    padding: ${({ theme }) => theme.spacing.xxl}px;
  }
`;

const StyledContentBody = styled.div.withConfig({
  displayName: 'StyledContentBody',
  componentId: 'StyledContentBody',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledContainer,
  StyledContent,
  StyledContentBody,
  StyledFooter,
  StyledHeader,
};
