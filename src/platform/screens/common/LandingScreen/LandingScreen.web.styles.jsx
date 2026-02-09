/**
 * LandingScreen Web Styles
 * File: LandingScreen.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 18}px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.md}px;
  }
`;

const StyledHero = styled.section.withConfig({
  displayName: 'StyledHero',
  componentId: 'StyledHero',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  display: flex;
  flex-direction: column;
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StyledOptionButton = styled.button.withConfig({
  displayName: 'StyledOptionButton',
  componentId: 'StyledOptionButton',
  shouldForwardProp: (prop) => prop !== '$selected',
})`
  width: 100%;
  min-height: 44px;
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
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;

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
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledCTA = styled.div.withConfig({
  displayName: 'StyledCTA',
  componentId: 'StyledCTA',
})`
  display: flex;
  justify-content: flex-start;
`;

const StyledChecklist = styled.ul.withConfig({
  displayName: 'StyledChecklist',
  componentId: 'StyledChecklist',
})`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChecklistItem = styled.li.withConfig({
  displayName: 'StyledChecklistItem',
  componentId: 'StyledChecklistItem',
})`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledChecklistBullet = styled.span.withConfig({
  displayName: 'StyledChecklistBullet',
  componentId: 'StyledChecklistBullet',
})`
  width: ${({ theme }) => theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing.xs / 2}px;
  flex-shrink: 0;
`;

export {
  StyledContainer,
  StyledContent,
  StyledHero,
  StyledSection,
  StyledOptionsGrid,
  StyledOptionButton,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledChecklist,
  StyledChecklistItem,
  StyledChecklistBullet,
};
