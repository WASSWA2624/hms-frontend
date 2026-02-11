/**
 * AuthLayout Web Styles
 * Styled-components for Web platform
 * File: AuthLayout.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== 'testID',
}).attrs(({ testID }) => ({
  'data-testid': testID,
}))`
  --auth-shell-pad: min(5vw, 32px);
  --auth-card-default: 760px;
  --auth-card-max: 980px;
  min-height: 100%;
  height: auto;
  width: 100%;
  background:
    radial-gradient(circle at 14% 18%, rgba(31, 123, 220, 0.12) 0%, rgba(31, 123, 220, 0) 38%),
    radial-gradient(circle at 86% 82%, rgba(60, 185, 227, 0.1) 0%, rgba(60, 185, 227, 0) 36%),
    linear-gradient(165deg, #f4f8ff 0%, #f9fbff 52%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding: 0 var(--auth-shell-pad);
  box-sizing: border-box;
  overflow: visible;

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    min-height: 100dvh;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px)
    and (max-width: ${({ theme }) => (theme.breakpoints?.desktop ?? 1024) - 1}px)
    and (orientation: landscape) {
    min-height: 100dvh;
  }
`;

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: fit-content;
  min-width: min(100%, var(--auth-card-default));
  max-width: min(100%, var(--auth-card-max));
  margin: 0 auto ${({ theme }) => theme.spacing.md}px;
  box-sizing: border-box;
`;

const StyledCard = styled.div.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  --auth-card-pad: clamp(16px, 2vw, 30px);
  width: fit-content;
  min-width: min(100%, var(--auth-card-default));
  max-width: min(100%, var(--auth-card-max));
  margin: 0 auto;
  background: linear-gradient(180deg, #ffffff 0%, #f6fbff 100%);
  border-radius: 0;
  padding: var(--auth-card-pad);
  border: 1px solid #bcd7f3;
  box-sizing: border-box;
  box-shadow: 0 20px 44px rgba(18, 57, 100, 0.16);
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - var(--auth-shell-pad));
  overflow: hidden;
  margin-bottom: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    min-height: calc(100dvh - var(--auth-shell-pad));
    height: calc(100dvh - var(--auth-shell-pad));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px)
    and (max-width: ${({ theme }) => (theme.breakpoints?.desktop ?? 1024) - 1}px)
    and (orientation: landscape) {
    min-height: calc(100dvh - var(--auth-shell-pad));
    height: calc(100dvh - var(--auth-shell-pad));
  }
`;

const StyledBrandHeader = styled.div.withConfig({
  displayName: 'StyledBrandHeader',
  componentId: 'StyledBrandHeader',
})`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBrandCopy = styled.div.withConfig({
  displayName: 'StyledBrandCopy',
  componentId: 'StyledBrandCopy',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledBrandName = styled.div.withConfig({
  displayName: 'StyledBrandName',
  componentId: 'StyledBrandName',
})`
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  line-height: 48px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledBranding = styled.div.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
})`
  display: flex;
  align-items: flex-start;
  flex: 0 0 auto;
  margin: calc(var(--auth-card-pad) * -1) calc(var(--auth-card-pad) * -1) ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px var(--auth-card-pad) ${({ theme }) => theme.spacing.sm}px;
  background: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 0;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
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
  StyledBanner,
  StyledBrandCopy,
  StyledContainer,
  StyledCard,
  StyledBrandHeader,
  StyledBrandName,
  StyledBranding,
  StyledContent,
  StyledHelpLinks,
};
