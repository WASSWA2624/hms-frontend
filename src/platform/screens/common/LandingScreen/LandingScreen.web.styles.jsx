/**
 * LandingScreen Web Styles
 * File: LandingScreen.web.styles.jsx
 */

import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== '$embedded',
})`
  min-height: ${({ $embedded }) => ($embedded ? 'auto' : '100vh')};
  width: 100%;
  background: ${({ theme, $embedded }) =>
    ($embedded
      ? 'transparent'
      : `radial-gradient(circle at 92% 4%, ${theme.colors.primary}12 0%, transparent 46%), ${theme.colors.background.primary}`)};
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 17}px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme) - 1}px) {
    padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.sm}px;
  }
`;

const StyledEmbeddedContent = styled.div.withConfig({
  displayName: 'StyledEmbeddedContent',
  componentId: 'StyledEmbeddedContent',
})`
  width: 100%;
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
  padding: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 10}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background: ${({ theme }) => theme.colors.background.primary};
  box-shadow: 0 1px 0 rgba(8, 34, 74, 0.08), 0 8px 16px rgba(8, 34, 74, 0.08);
`;

const StyledOptionsGrid = styled.div.withConfig({
  displayName: 'StyledOptionsGrid',
  componentId: 'StyledOptionsGrid',
})`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
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
  min-height: 52px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 8}px;
  border: 1px solid ${({ theme, $selected }) =>
    ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.background.secondary : theme.colors.background.primary)};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  text-align: left;
  cursor: pointer;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  box-shadow: ${({ $selected }) =>
    ($selected
      ? '0 2px 0 rgba(8, 34, 74, 0.14), 0 9px 16px rgba(8, 34, 74, 0.14)'
      : '0 1px 0 rgba(8, 34, 74, 0.1), 0 6px 12px rgba(8, 34, 74, 0.09)')};
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 0 rgba(8, 34, 74, 0.18), 0 11px 18px rgba(8, 34, 74, 0.16);
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
  border: 1px solid ${({ theme }) => `${theme.colors.primary}3d`};
  background-color: ${({ theme }) => `${theme.colors.primary}12`};
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
  background: ${({ theme, $selected }) =>
    ($selected
      ? `linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.secondary})`
      : 'transparent')};
  flex-shrink: 0;
`;

const StyledHelperText = styled.div.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding-left: ${({ theme }) => theme.spacing.xs}px;
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
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledCTAProceedAction = styled.div.withConfig({
  displayName: 'StyledCTAProceedAction',
  componentId: 'StyledCTAProceedAction',
})`
  width: 100%;
  display: flex;
  align-items: stretch;

  > * {
    width: 100%;
  }
`;

export {
  StyledContainer,
  StyledContent,
  StyledEmbeddedContent,
  StyledSection,
  StyledOptionsGrid,
  StyledOptionButton,
  StyledOptionIcon,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledCTAProceedAction,
};
