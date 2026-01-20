/**
 * AuthLayout Web Styles
 * Styled-components for Web platform
 * File: AuthLayout.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
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
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.md * 25}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  box-shadow: ${({ theme }) => {
    if (theme.shadows?.md) {
      const shadow = theme.shadows.md;
      return `${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px ${shadow.shadowRadius * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity})`;
    }
    return 'none';
  }};
`;

const StyledBranding = styled.div.withConfig({
  displayName: 'StyledBranding',
})`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
})`
  width: 100%;
`;

const StyledHelpLinks = styled.div.withConfig({
  displayName: 'StyledHelpLinks',
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

