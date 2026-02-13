/**
 * WelcomeEntryScreen Web Styles
 */
import styled, { css } from 'styled-components';
import { Button } from '@platform/components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'WelcomeEntry_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 18}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHero = styled.div.withConfig({
  displayName: 'StyledHero',
  componentId: 'WelcomeEntry_StyledHero',
})`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}40`};
  background: radial-gradient(circle at 100% 0%, ${({ theme }) => `${theme.colors.primary}25`} 0%, transparent 55%),
    linear-gradient(
      145deg,
      ${({ theme }) => theme.colors.background.primary} 0%,
      ${({ theme }) => theme.colors.background.secondary} 100%
    );
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.sm;
    if (!shadow) return 'none';
    return `${shadow.shadowOffset?.width ?? 0}px ${shadow.shadowOffset?.height ?? 2}px ${(shadow.shadowRadius ?? 3) * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity ?? 0.1})`;
  }};
`;

const StyledHeroBadge = styled.div.withConfig({
  displayName: 'StyledHeroBadge',
  componentId: 'WelcomeEntry_StyledHeroBadge',
})`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}66`};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => `${theme.colors.primary}12`} 100%
  );
  box-shadow: 0 2px 0 rgba(8, 34, 74, 0.14), 0 7px 12px rgba(8, 34, 74, 0.1);
`;

const StyledHeader = styled.div.withConfig({
  displayName: 'StyledHeader',
  componentId: 'WelcomeEntry_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFeatureGrid = styled.div.withConfig({
  displayName: 'StyledFeatureGrid',
  componentId: 'WelcomeEntry_StyledFeatureGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;

  @media (max-width: ${({ theme }) => getTablet(theme) - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFeatureCard = styled.div.withConfig({
  displayName: 'StyledFeatureCard',
  componentId: 'WelcomeEntry_StyledFeatureCard',
})`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledFeatureIcon = styled.div.withConfig({
  displayName: 'StyledFeatureIcon',
  componentId: 'WelcomeEntry_StyledFeatureIcon',
})`
  width: ${({ theme }) => theme.spacing.lg}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
`;

const StyledFeatureCopy = styled.div.withConfig({
  displayName: 'StyledFeatureCopy',
  componentId: 'WelcomeEntry_StyledFeatureCopy',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledBody = styled.div.withConfig({
  displayName: 'StyledBody',
  componentId: 'WelcomeEntry_StyledBody',
})`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: start;

  @media (max-width: ${({ theme }) => getTablet(theme) - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledJourneyPanel = styled.div.withConfig({
  displayName: 'StyledJourneyPanel',
  componentId: 'WelcomeEntry_StyledJourneyPanel',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledJourneyCard = styled.div.withConfig({
  displayName: 'StyledJourneyCard',
  componentId: 'WelcomeEntry_StyledJourneyCard',
})`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  transition: transform ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'},
    border-color ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'};

  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => `${theme.colors.primary}70`};
      transform: translateY(-1px);
    }
  }
`;

const StyledJourneyIndex = styled.span.withConfig({
  displayName: 'StyledJourneyIndex',
  componentId: 'WelcomeEntry_StyledJourneyIndex',
})`
  width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledJourneyCopy = styled.div.withConfig({
  displayName: 'StyledJourneyCopy',
  componentId: 'WelcomeEntry_StyledJourneyCopy',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledActionPanel = styled.div.withConfig({
  displayName: 'StyledActionPanel',
  componentId: 'WelcomeEntry_StyledActionPanel',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const ctaButtonBase = css`
  && {
    width: 100%;
    border-radius: ${({ theme }) => theme.radius.md}px;
    min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
    transform: translateY(0);
    transition:
      transform ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
        ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'},
      box-shadow ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
        ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'},
      filter ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
        ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'};
  }

  &&::after {
    content: '';
    position: absolute;
    left: 1px;
    right: 1px;
    top: 1px;
    height: 45%;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0));
    opacity: 0.45;
  }

  &&:hover {
    transform: translateY(-1px);
    filter: saturate(1.05);
  }

  &&:active {
    transform: translateY(0);
  }
`;

const StyledSignInButton = styled(Button).attrs({
  variant: 'primary',
  size: 'small',
  type: 'button',
})`
  ${ctaButtonBase}

  && {
    border: 1px solid ${({ theme }) => `${theme.colors.primary}B3`};
    background: linear-gradient(
      180deg,
      ${({ theme }) => `${theme.colors.primary}F2`} 0%,
      ${({ theme }) => theme.colors.primary} 62%,
      ${({ theme }) => `${theme.colors.primary}D9`} 100%
    );
    box-shadow: 0 3px 0 rgba(8, 34, 74, 0.32), 0 10px 18px rgba(8, 34, 74, 0.2);
  }

  &&:hover {
    box-shadow: 0 4px 0 rgba(8, 34, 74, 0.34), 0 12px 20px rgba(8, 34, 74, 0.23);
  }
`;

const StyledCreateAccountButton = styled(Button).attrs({
  variant: 'surface',
  size: 'small',
  type: 'button',
})`
  ${ctaButtonBase}

  && {
    border: 1px solid ${({ theme }) => `${theme.colors.primary}66`};
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.background.primary} 0%,
      ${({ theme }) => theme.colors.background.secondary} 100%
    );
    box-shadow: 0 2px 0 rgba(16, 26, 42, 0.18), 0 9px 16px rgba(10, 30, 70, 0.14);
  }

  &&:hover {
    box-shadow: 0 3px 0 rgba(16, 26, 42, 0.2), 0 12px 18px rgba(10, 30, 70, 0.17);
  }
`;

const StyledVerifyEmailButton = styled(Button).attrs({
  variant: 'outline',
  size: 'small',
  type: 'button',
})`
  ${ctaButtonBase}

  && {
    border: 1px solid ${({ theme }) => `${theme.colors.primary}99`};
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.background.primary} 0%,
      ${({ theme }) => `${theme.colors.primary}0F`} 100%
    );
    box-shadow: 0 2px 0 rgba(8, 34, 74, 0.2), 0 8px 14px rgba(8, 34, 74, 0.13);
  }

  &&:hover {
    box-shadow: 0 3px 0 rgba(8, 34, 74, 0.23), 0 11px 17px rgba(8, 34, 74, 0.16);
  }
`;

const StyledResumeCard = styled.div.withConfig({
  displayName: 'StyledResumeCard',
  componentId: 'WelcomeEntry_StyledResumeCard',
})`
  border-left: ${({ theme }) => theme.spacing.xs}px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'WelcomeEntry_StyledActions',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;

  > * {
    width: 100%;
  }
`;

const StyledResumeContent = styled.div.withConfig({
  displayName: 'StyledResumeContent',
  componentId: 'WelcomeEntry_StyledResumeContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledResumeActions = styled.div.withConfig({
  displayName: 'StyledResumeActions',
  componentId: 'WelcomeEntry_StyledResumeActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

export {
  StyledActionPanel,
  StyledActions,
  StyledBody,
  StyledContainer,
  StyledCreateAccountButton,
  StyledFeatureCard,
  StyledFeatureCopy,
  StyledFeatureGrid,
  StyledFeatureIcon,
  StyledHero,
  StyledHeroBadge,
  StyledHeader,
  StyledJourneyCard,
  StyledJourneyCopy,
  StyledJourneyIndex,
  StyledJourneyPanel,
  StyledResumeActions,
  StyledResumeCard,
  StyledResumeContent,
  StyledSignInButton,
  StyledVerifyEmailButton,
};
