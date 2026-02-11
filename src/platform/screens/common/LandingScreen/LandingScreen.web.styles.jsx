/**
 * LandingScreen Web Styles
 * File: LandingScreen.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== '$embedded',
})`
  min-height: ${({ $embedded }) => ($embedded ? 'auto' : '100vh')};
  width: 100%;
  background-color: ${({ theme, $embedded }) =>
    ($embedded ? 'transparent' : theme.colors.background.primary)};
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', 'Inter', 'Roboto', sans-serif;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 18}px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.sm}px;
  }
`;

const StyledEmbeddedContent = styled.div.withConfig({
  displayName: 'StyledEmbeddedContent',
  componentId: 'StyledEmbeddedContent',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHero = styled.section.withConfig({
  displayName: 'StyledHero',
  componentId: 'StyledHero',
})`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeroBadge = styled.span.withConfig({
  displayName: 'StyledHeroBadge',
  componentId: 'StyledHeroBadge',
})`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledOptionsGrid = styled.div.withConfig({
  displayName: 'StyledOptionsGrid',
  componentId: 'StyledOptionsGrid',
})`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop || 1024}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledOptionButton = styled.button.withConfig({
  displayName: 'StyledOptionButton',
  componentId: 'StyledOptionButton',
  shouldForwardProp: (prop) => prop !== '$selected',
})`
  width: 100%;
  min-height: 54px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  border: 1px solid ${({ theme, $selected }) =>
    ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.background.secondary : theme.colors.background.primary)};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  text-align: left;
  cursor: pointer;
  font: inherit;
  box-shadow: ${({ theme, $selected }) =>
    $selected ? `0 6px 18px rgba(0,0,0,0.08)` : 'none'};
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const StyledOptionIcon = styled.span.withConfig({
  displayName: 'StyledOptionIcon',
  componentId: 'StyledOptionIcon',
})`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  font-size: 14px;
  flex-shrink: 0;
`;

const StyledOptionIndicator = styled.span.withConfig({
  displayName: 'StyledOptionIndicator',
  componentId: 'StyledOptionIndicator',
  shouldForwardProp: (prop) => prop !== '$selected',
})`
  width: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  border: 2px solid ${({ theme, $selected }) =>
    ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : 'transparent')};
  flex-shrink: 0;
`;

const StyledHelperText = styled.div.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledCTA = styled.div.withConfig({
  displayName: 'StyledCTA',
  componentId: 'StyledCTA',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xs}px;

  > * {
    width: 100%;
  }
`;

const StyledCtaHelper = styled.span.withConfig({
  displayName: 'StyledCtaHelper',
  componentId: 'StyledCtaHelper',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

export {
  StyledContainer,
  StyledContent,
  StyledEmbeddedContent,
  StyledHero,
  StyledHeroBadge,
  StyledSection,
  StyledOptionsGrid,
  StyledOptionButton,
  StyledOptionIcon,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledCtaHelper,
};
