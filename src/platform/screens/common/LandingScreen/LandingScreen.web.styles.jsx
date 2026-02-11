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
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
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
  gap: ${({ theme }) => theme.spacing.lg}px;

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
  gap: clamp(6px, 0.6vw, 10px);
`;

const StyledHero = styled.section.withConfig({
  displayName: 'StyledHero',
  componentId: 'StyledHero',
})`
  display: flex;
  flex-direction: column;
  padding: clamp(10px, 0.8vw, 12px);
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  gap: ${({ theme }) => theme.spacing.xs}px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.sm;
    if (!shadow) return 'none';
    return `${shadow.shadowOffset?.width ?? 0}px ${shadow.shadowOffset?.height ?? 1}px ${(shadow.shadowRadius ?? 2) * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity ?? 0.1})`;
  }};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
`;

const StyledHeroBadge = styled.span.withConfig({
  displayName: 'StyledHeroBadge',
  componentId: 'StyledHeroBadge',
})`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border: 0;
  background-color: transparent;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledOptionsGrid = styled.div.withConfig({
  displayName: 'StyledOptionsGrid',
  componentId: 'StyledOptionsGrid',
})`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    > :last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }
`;

const StyledOptionButton = styled.button.withConfig({
  displayName: 'StyledOptionButton',
  componentId: 'StyledOptionButton',
  shouldForwardProp: (prop) => prop !== '$selected',
})`
  width: 100%;
  min-height: clamp(50px, 5.8vh, 58px);
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: 0;
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
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  box-shadow: ${({ theme, $selected }) =>
    ($selected
      ? `${theme.shadows?.md?.shadowOffset?.width ?? 0}px ${theme.shadows?.md?.shadowOffset?.height ?? 2}px ${(theme.shadows?.md?.shadowRadius ?? 4) * 2}px rgba(0, 0, 0, ${theme.shadows?.md?.shadowOpacity ?? 0.15})`
      : `${theme.shadows?.sm?.shadowOffset?.width ?? 0}px ${theme.shadows?.sm?.shadowOffset?.height ?? 1}px ${(theme.shadows?.sm?.shadowRadius ?? 2) * 2}px rgba(0, 0, 0, ${theme.shadows?.sm?.shadowOpacity ?? 0.1})`)};
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => {
      const shadow = theme.shadows?.md;
      if (!shadow) return 'none';
      return `${shadow.shadowOffset?.width ?? 0}px ${shadow.shadowOffset?.height ?? 2}px ${(shadow.shadowRadius ?? 4) * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity ?? 0.15})`;
    }};
    transform: translateY(-1px);
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
  width: ${({ theme }) => theme.spacing.md + 2}px;
  height: ${({ theme }) => theme.spacing.md + 2}px;
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledCTA = styled.div.withConfig({
  displayName: 'StyledCTA',
  componentId: 'StyledCTA',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;

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
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
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

