/**
 * WelcomeEntryScreen iOS Styles
 */
import styled, { css } from 'styled-components/native';
import { Button } from '@platform/components';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'WelcomeEntry_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  align-self: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHero = styled.View.withConfig({
  displayName: 'StyledHero',
  componentId: 'WelcomeEntry_StyledHero',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}40`};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeroBadge = styled.View.withConfig({
  displayName: 'StyledHeroBadge',
  componentId: 'WelcomeEntry_StyledHeroBadge',
})`
  align-self: flex-start;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}66`};
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => `${theme.colors.primary}12`};
  shadow-color: #08224a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 4px;
  elevation: 3;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'WelcomeEntry_StyledHeader',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFeatureGrid = styled.View.withConfig({
  displayName: 'StyledFeatureGrid',
  componentId: 'WelcomeEntry_StyledFeatureGrid',
})`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFeatureCard = styled.View.withConfig({
  displayName: 'StyledFeatureCard',
  componentId: 'WelcomeEntry_StyledFeatureCard',
})`
  width: 49%;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledFeatureIcon = styled.View.withConfig({
  displayName: 'StyledFeatureIcon',
  componentId: 'WelcomeEntry_StyledFeatureIcon',
})`
  width: ${({ theme }) => theme.spacing.lg}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
`;

const StyledFeatureCopy = styled.View.withConfig({
  displayName: 'StyledFeatureCopy',
  componentId: 'WelcomeEntry_StyledFeatureCopy',
})`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledBody = styled.View.withConfig({
  displayName: 'StyledBody',
  componentId: 'WelcomeEntry_StyledBody',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledJourneyPanel = styled.View.withConfig({
  displayName: 'StyledJourneyPanel',
  componentId: 'WelcomeEntry_StyledJourneyPanel',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledJourneyCard = styled.View.withConfig({
  displayName: 'StyledJourneyCard',
  componentId: 'WelcomeEntry_StyledJourneyCard',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledJourneyIndex = styled.View.withConfig({
  displayName: 'StyledJourneyIndex',
  componentId: 'WelcomeEntry_StyledJourneyIndex',
})`
  width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const StyledJourneyCopy = styled.View.withConfig({
  displayName: 'StyledJourneyCopy',
  componentId: 'WelcomeEntry_StyledJourneyCopy',
})`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledActionPanel = styled.View.withConfig({
  displayName: 'StyledActionPanel',
  componentId: 'WelcomeEntry_StyledActionPanel',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const ctaButtonBase = css`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  shadow-color: #08224a;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.14;
  shadow-radius: 5px;
  elevation: 4;
`;

const StyledSignInButton = styled(Button).attrs({
  variant: 'primary',
  size: 'small',
})`
  ${ctaButtonBase}
  border-color: ${({ theme }) => `${theme.colors.primary}B3`};
  shadow-opacity: 0.22;
  elevation: 5;
`;

const StyledCreateAccountButton = styled(Button).attrs({
  variant: 'surface',
  size: 'small',
})`
  ${ctaButtonBase}
  border-color: ${({ theme }) => `${theme.colors.primary}66`};
  shadow-opacity: 0.12;
  elevation: 4;
`;

const StyledVerifyEmailButton = styled(Button).attrs({
  variant: 'outline',
  size: 'small',
})`
  ${ctaButtonBase}
  border-color: ${({ theme }) => `${theme.colors.primary}99`};
  background-color: ${({ theme }) => theme.colors.background.primary};
  shadow-opacity: 0.1;
  elevation: 3;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'WelcomeEntry_StyledActions',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: stretch;
`;

const StyledResumeCard = styled.View.withConfig({
  displayName: 'StyledResumeCard',
  componentId: 'WelcomeEntry_StyledResumeCard',
})`
  border-left-width: ${({ theme }) => theme.spacing.xs}px;
  border-left-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
`;

const StyledResumeContent = styled.View.withConfig({
  displayName: 'StyledResumeContent',
  componentId: 'WelcomeEntry_StyledResumeContent',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledResumeActions = styled.View.withConfig({
  displayName: 'StyledResumeActions',
  componentId: 'WelcomeEntry_StyledResumeActions',
})`
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  align-items: stretch;
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
