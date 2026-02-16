/**
 * AuthLayout Web Styles
 * Styled-components for Web platform
 * File: AuthLayout.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main
  .withConfig({
    displayName: 'StyledContainer',
    componentId: 'StyledContainer',
    shouldForwardProp: (prop) => prop !== 'testID',
  })
  .attrs(({ testID }) => ({
    'data-testid': testID,
  }))`
  --auth-shell-pad: clamp(12px, 5vw, 32px);
  --auth-card-default: 760px;
  --auth-card-max: 980px;
  min-height: 100%;
  height: auto;
  width: 100%;
  background: linear-gradient(
    165deg,
    #f2f9ff 0%,
    #e7f3ff 55%,
    #dceeff 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding: 0 var(--auth-shell-pad) var(--auth-shell-pad);
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

  @media (max-width: ${({ theme }) => (theme.breakpoints?.tablet ?? 768) - 1}px) {
    min-height: 100dvh;
    height: 100dvh;
    margin-top: 0;
    padding-top: calc(${({ theme }) => theme.spacing.sm}px + env(safe-area-inset-top, 0px));
    padding-left: calc(var(--auth-shell-pad) + env(safe-area-inset-left, 0px));
    padding-right: calc(var(--auth-shell-pad) + env(safe-area-inset-right, 0px));
    padding-bottom: calc(var(--auth-shell-pad) + env(safe-area-inset-bottom, 0px));
    position: fixed;
    inset: 0;
    overscroll-behavior: none;
    overflow: hidden;
  }
`;

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
  min-width: 0;
  max-width: min(100%, var(--auth-card-max));
  margin: 0 auto ${({ theme }) => theme.spacing.md}px;
  box-sizing: border-box;
`;

const StyledCard = styled.div.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  --auth-card-pad: clamp(16px, 2vw, 30px);
  width: 100%;
  min-width: 0;
  max-width: min(100%, var(--auth-card-max));
  margin: 0 auto;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: var(--auth-card-pad);
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  box-sizing: border-box;
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.md;
    if (!shadow) return 'none';
    return `${shadow.shadowOffset?.width ?? 0}px ${shadow.shadowOffset?.height ?? 2}px ${(shadow.shadowRadius ?? 4) * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity ?? 0.15})`;
  }};
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - var(--auth-shell-pad));
  overflow: hidden;
  margin-bottom: 0;

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    flex: 1 1 0%;
    max-height: 100%;
    min-height: 0;
    height: auto;
    overflow: hidden;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    min-height: calc(100dvh - var(--auth-shell-pad));
    height: calc(100dvh - var(--auth-shell-pad));
  }

  @media (min-width: ${({ theme }) =>
      theme.breakpoints?.tablet ?? 768}px) and (max-width: ${({ theme }) =>
      (theme.breakpoints?.desktop ?? 1024) -
      1}px) and (orientation: landscape) {
    min-height: calc(100dvh - var(--auth-shell-pad));
    height: calc(100dvh - var(--auth-shell-pad));
  }
`;

const StyledBrandHeader = styled.div.withConfig({
  displayName: 'StyledBrandHeader',
  componentId: 'StyledBrandHeader',
})`
  display: flex;
  width: ${({ $centered }) => ($centered ? '100%' : 'auto')};
  align-items: center;
  justify-content: ${({ $centered }) => ($centered ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    gap: ${({ theme }) => theme.spacing.xs}px;
  }
`;

const StyledBrandLogoShell = styled.div.withConfig({
  displayName: 'StyledBrandLogoShell',
  componentId: 'StyledBrandLogoShell',
})`
  --brand-mark-size: clamp(56px, 8vw, 76px);
  --brand-logo-size: calc(var(--brand-mark-size) - 16px);
  position: relative;
  width: var(--brand-mark-size);
  height: var(--brand-mark-size);
  min-width: var(--brand-mark-size);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}66`};
  background:
    radial-gradient(
      circle at 28% 22%,
      rgba(255, 255, 255, 0.92) 0%,
      rgba(255, 255, 255, 0.18) 40%,
      transparent 62%
    ),
    linear-gradient(
      150deg,
      ${({ theme }) => theme.colors.background.primary} 0%,
      ${({ theme }) => `${theme.colors.primary}2B`} 100%
    );
  box-shadow:
    0 2px 0 rgba(8, 34, 74, 0.22),
    0 12px 22px rgba(8, 34, 74, 0.16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: calc(${({ theme }) => theme.radius.lg}px - 4px);
    border: 1px solid ${({ theme }) => `${theme.colors.primary}2B`};
    pointer-events: none;
  }

  img {
    width: var(--brand-logo-size) !important;
    height: var(--brand-logo-size) !important;
    filter: drop-shadow(0 2px 4px rgba(12, 24, 45, 0.18));
  }

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    --brand-mark-size: 52px;
  }
`;

const StyledBrandCopy = styled.div.withConfig({
  displayName: 'StyledBrandCopy',
  componentId: 'StyledBrandCopy',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  min-width: 0;
`;

const StyledBrandName = styled.div.withConfig({
  displayName: 'StyledBrandName',
  componentId: 'StyledBrandName',
})`
  display: flex;
  align-items: center;
  min-height: 0;
  line-height: 1;

  h1,
  h2,
  h3,
  span {
    margin: 0;
    font-size: clamp(28px, 4.4vw, 40px) !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
    letter-spacing: -0.03em;
    text-wrap: balance;
    text-align: ${({ $centered }) => ($centered ? 'center' : 'left')};
    color: ${({ theme }) => theme.colors.text.primary};
    background: linear-gradient(
      140deg,
      ${({ theme }) => theme.colors.text.primary} 0%,
      ${({ theme }) => `${theme.colors.primary}D9`} 74%,
      ${({ theme }) => `${theme.colors.primary}A6`} 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    max-width: 78%;

    h1,
    h2,
    h3,
    span {
      font-size: clamp(15px, 4.6vw, 20px) !important;
      line-height: 1.2 !important;
      letter-spacing: -0.01em;
      white-space: nowrap;
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: none;
      -webkit-text-fill-color: ${({ theme }) => theme.colors.text.primary};
    }
  }
`;

const StyledBranding = styled.div.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
})`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: ${({ $hasSupplementalBranding }) =>
    ($hasSupplementalBranding ? 'space-between' : 'center')};
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex: 0 0 auto;
  margin: calc(var(--auth-card-pad) * -1) calc(var(--auth-card-pad) * -1)
    ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px var(--auth-card-pad)
    ${({ theme }) => theme.spacing.sm}px;
  background:
    radial-gradient(
      circle at 100% 0%,
      ${({ theme }) => `${theme.colors.primary}24`} 0%,
      transparent 56%
    ),
    linear-gradient(
      165deg,
      ${({ theme }) => `${theme.colors.primary}0F`} 0%,
      ${({ theme }) => `${theme.colors.background.primary}E6`} 50%,
      ${({ theme }) => `${theme.colors.background.secondary}E6`} 100%
    );
  margin-bottom: ${({ theme, $withScreenHeader }) =>
    ($withScreenHeader ? theme.spacing.xs / 2 : theme.spacing.md)}px;
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.primary}33`};

  &::after {
    content: '';
    position: absolute;
    left: var(--auth-card-pad);
    right: var(--auth-card-pad);
    bottom: 0;
    height: 2px;
    border-radius: ${({ theme }) => theme.radius.full}px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => `${theme.colors.primary}A6`} 0%,
      ${({ theme }) => `${theme.colors.primary}2B`} 100%
    );
  }

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    padding: ${({ theme }) => theme.spacing.sm}px var(--auth-card-pad);
    margin-bottom: ${({ theme, $withScreenHeader }) =>
      ($withScreenHeader ? theme.spacing.xs / 2 : theme.spacing.sm)}px;
  }
`;

const StyledScreenHeader = styled.section.withConfig({
  displayName: 'StyledScreenHeader',
  componentId: 'StyledScreenHeader',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  padding: ${({ theme }) => theme.spacing.xs / 2}px ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-top-left-radius: ${({ theme }) => theme.radius.md}px;
  border-top-right-radius: ${({ theme }) => theme.radius.md}px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}33`};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  box-shadow: 0 1px 0 rgba(8, 34, 74, 0.1), 0 8px 12px rgba(8, 34, 74, 0.08);
`;

const StyledScreenHeaderRow = styled.div.withConfig({
  displayName: 'StyledScreenHeaderRow',
  componentId: 'StyledScreenHeaderRow',
})`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledScreenHeaderCopy = styled.div.withConfig({
  displayName: 'StyledScreenHeaderCopy',
  componentId: 'StyledScreenHeaderCopy',
})`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const StyledScreenHeaderTitle = styled.div.withConfig({
  displayName: 'StyledScreenHeaderTitle',
  componentId: 'StyledScreenHeaderTitle',
})`
  span,
  h1,
  h2,
  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    white-space: nowrap;
  }
`;

const StyledScreenHeaderSubtitle = styled.div.withConfig({
  displayName: 'StyledScreenHeaderSubtitle',
  componentId: 'StyledScreenHeaderSubtitle',
})`
  span,
  h1,
  h2,
  h3 {
    margin: 0;
  }
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

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
  }
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
  StyledBrandLogoShell,
  StyledContainer,
  StyledCard,
  StyledBrandHeader,
  StyledBrandName,
  StyledBranding,
  StyledContent,
  StyledHelpLinks,
  StyledScreenHeader,
  StyledScreenHeaderRow,
  StyledScreenHeaderCopy,
  StyledScreenHeaderTitle,
  StyledScreenHeaderSubtitle,
};
