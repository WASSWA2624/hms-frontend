/**
 * AuthLayout Web Styles
 * Styled-components for Web platform
 * File: AuthLayout.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
}).attrs(({ testID }) => ({
  'data-testid': testID,
}))`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledCard = styled.div.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.md * 25}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  box-shadow: ${({ theme }) => {
    if (theme.shadows?.sm) {
      const s = theme.shadows.sm;
      return `${s.shadowOffset?.width ?? 0}px ${s.shadowOffset?.height ?? 1}px ${(s.shadowRadius ?? 2) * 2}px rgba(0, 0, 0, ${s.shadowOpacity ?? 0.1})`;
    }
    return 'none';
  }};
`;

const StyledBranding = styled.div.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
})`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
`;

const StyledHelpLinks = styled.div.withConfig({
  displayName: 'StyledHelpLinks',
  componentId: 'StyledHelpLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  align-items: center;
`;

export {
  StyledContainer,
  StyledCard,
  StyledBranding,
  StyledContent,
  StyledHelpLinks,
};

