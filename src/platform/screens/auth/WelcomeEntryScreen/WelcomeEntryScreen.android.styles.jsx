/**
 * WelcomeEntryScreen Android Styles
 */
import styled, { css } from 'styled-components/native';
import { Button, Text } from '@platform/components';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'WelcomeEntry_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 20}px;
  align-self: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHero = styled.View.withConfig({
  displayName: 'StyledHero',
  componentId: 'WelcomeEntry_StyledHero',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}52`};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  gap: ${({ theme }) => theme.spacing.sm}px;
  shadow-color: #08224a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  elevation: 4;
`;

const StyledAudiencePills = styled.View.withConfig({
  displayName: 'StyledAudiencePills',
  componentId: 'WelcomeEntry_StyledAudiencePills',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledAudiencePill = styled.View.withConfig({
  displayName: 'StyledAudiencePill',
  componentId: 'WelcomeEntry_StyledAudiencePill',
})`
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}7A`};
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => `${theme.colors.primary}1A`};
  shadow-color: #08224a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 5px;
  elevation: 3;
`;

const StyledAudiencePillIcon = styled.View.withConfig({
  displayName: 'StyledAudiencePillIcon',
  componentId: 'WelcomeEntry_StyledAudiencePillIcon',
})`
  width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}66`};
  background-color: ${({ theme }) => `${theme.colors.primary}14`};
`;

const StyledAudiencePillLabel = styled(Text).attrs({
  variant: 'body',
  color: 'primary',
})`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
`;

const StyledFeatureGrid = styled.View.withConfig({
  displayName: 'StyledFeatureGrid',
  componentId: 'WelcomeEntry_StyledFeatureGrid',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFeatureCard = styled.View.withConfig({
  displayName: 'StyledFeatureCard',
  componentId: 'WelcomeEntry_StyledFeatureCard',
})`
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}33`};
  border-left-width: ${({ theme }) => theme.spacing.xs}px;
  border-left-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => `${theme.colors.primary}0B`};
  shadow-color: #08224a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 3;
`;

const StyledFeatureIcon = styled.View.withConfig({
  displayName: 'StyledFeatureIcon',
  componentId: 'WelcomeEntry_StyledFeatureIcon',
})`
  width: ${({ theme }) => theme.spacing.lg + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.lg + theme.spacing.xs}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}4D`};
  background-color: ${({ theme }) => `${theme.colors.primary}14`};
`;

const StyledFeatureCopy = styled.View.withConfig({
  displayName: 'StyledFeatureCopy',
  componentId: 'WelcomeEntry_StyledFeatureCopy',
})`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledBody = styled.View.withConfig({
  displayName: 'StyledBody',
  componentId: 'WelcomeEntry_StyledBody',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const panelCardBase = css`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledActionPanel = styled.View.withConfig({
  displayName: 'StyledActionPanel',
  componentId: 'WelcomeEntry_StyledActionPanel',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ctaButtonBase = css`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
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

const StyledActionsCard = styled.View.withConfig({
  displayName: 'StyledActionsCard',
  componentId: 'WelcomeEntry_StyledActionsCard',
})`
  ${panelCardBase}
  border-color: ${({ theme }) => `${theme.colors.primary}52`};
  shadow-color: #08224a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 5px;
  elevation: 3;
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
  StyledActionsCard,
  StyledAudiencePill,
  StyledAudiencePillIcon,
  StyledAudiencePillLabel,
  StyledAudiencePills,
  StyledBody,
  StyledContainer,
  StyledCreateAccountButton,
  StyledFeatureCard,
  StyledFeatureCopy,
  StyledFeatureGrid,
  StyledFeatureIcon,
  StyledHero,
  StyledResumeActions,
  StyledResumeCard,
  StyledResumeContent,
  StyledSignInButton,
  StyledVerifyEmailButton,
};
