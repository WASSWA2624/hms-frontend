/**
 * WelcomeEntryScreen Web Styles
 */
import styled, { css } from 'styled-components';
import { Button } from '@platform/components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;
const getDesktop = (theme) => theme.breakpoints?.desktop ?? 1024;

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'WelcomeEntry_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 20}px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHero = styled.div.withConfig({
  displayName: 'StyledHero',
  componentId: 'WelcomeEntry_StyledHero',
})`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}52`};
  background: radial-gradient(circle at 100% 0%, ${({ theme }) => `${theme.colors.primary}25`} 0%, transparent 55%),
    linear-gradient(
      145deg,
      ${({ theme }) => theme.colors.background.primary} 0%,
      ${({ theme }) => theme.colors.background.secondary} 100%
    );
  box-shadow: ${({ theme }) => {
    const baseShadow = '0 2px 0 rgba(8, 34, 74, 0.16), 0 14px 28px rgba(8, 34, 74, 0.16)';
    const shadow = theme.shadows?.sm;
    if (!shadow) return baseShadow;
    const tokenShadow = `${shadow.shadowOffset?.width ?? 0}px ${shadow.shadowOffset?.height ?? 2}px ${(shadow.shadowRadius ?? 3) * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity ?? 0.1})`;
    return `${baseShadow}, ${tokenShadow}`;
  }};

  &::before {
    content: '';
    position: absolute;
    width: ${({ theme }) => theme.spacing.xxl * 3}px;
    height: ${({ theme }) => theme.spacing.xxl * 3}px;
    border-radius: ${({ theme }) => theme.radius.full}px;
    top: -${({ theme }) => theme.spacing.lg}px;
    right: -${({ theme }) => theme.spacing.lg}px;
    background: radial-gradient(circle, ${({ theme }) => `${theme.colors.primary}40`} 0%, transparent 72%);
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => getTablet(theme) - 1}px) {
    padding: ${({ theme }) => theme.spacing.md}px;
  }
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
  max-width: ${({ theme }) => theme.spacing.xxl * 12}px;
`;

const StyledAudiencePills = styled.div.withConfig({
  displayName: 'StyledAudiencePills',
  componentId: 'WelcomeEntry_StyledAudiencePills',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StyledAudiencePill = styled.span.withConfig({
  displayName: 'StyledAudiencePill',
  componentId: 'WelcomeEntry_StyledAudiencePill',
})`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  width: 100%;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.md}px`};
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}7A`};
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => `${theme.colors.primary}1A`} 100%
  );
  box-shadow: 0 2px 0 rgba(8, 34, 74, 0.16), 0 8px 12px rgba(8, 34, 74, 0.12);
  transition:
    transform ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'},
    box-shadow ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'},
    border-color ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0));
    opacity: 0.36;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-1px);
      border-color: ${({ theme }) => `${theme.colors.primary}99`};
      box-shadow: 0 3px 0 rgba(8, 34, 74, 0.19), 0 10px 14px rgba(8, 34, 74, 0.14);
    }
  }
`;

const StyledAudiencePillIcon = styled.span.withConfig({
  displayName: 'StyledAudiencePillIcon',
  componentId: 'WelcomeEntry_StyledAudiencePillIcon',
})`
  width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}66`};
  background: linear-gradient(
    180deg,
    ${({ theme }) => `${theme.colors.primary}2E`} 0%,
    ${({ theme }) => `${theme.colors.primary}14`} 100%
  );
`;

const StyledAudiencePillLabel = styled.span.withConfig({
  displayName: 'StyledAudiencePillLabel',
  componentId: 'WelcomeEntry_StyledAudiencePillLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.fontSize.lg * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;

  @media (max-width: ${({ theme }) => getTablet(theme) - 1}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
    line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  }
`;

const StyledFeatureGrid = styled.div.withConfig({
  displayName: 'StyledFeatureGrid',
  componentId: 'WelcomeEntry_StyledFeatureGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledFeatureCard = styled.div.withConfig({
  displayName: 'StyledFeatureCard',
  componentId: 'WelcomeEntry_StyledFeatureCard',
})`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: start;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}33`};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => `${theme.colors.primary}0B`} 100%
  );
  box-shadow: 0 2px 0 rgba(8, 34, 74, 0.12), 0 8px 14px rgba(8, 34, 74, 0.1);
  transition:
    transform ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'},
    border-color ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'},
    box-shadow ${({ theme }) => theme.animations?.duration?.normal ?? 200}ms
      ${({ theme }) => theme.animations?.easing?.easeOut ?? 'ease-out'};

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: ${({ theme }) => theme.spacing.xs}px;
    background: linear-gradient(
      180deg,
      ${({ theme }) => `${theme.colors.primary}CC`} 0%,
      ${({ theme }) => `${theme.colors.primary}66`} 100%
    );
    opacity: 0.9;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      border-color: ${({ theme }) => `${theme.colors.primary}66`};
      box-shadow: 0 3px 0 rgba(8, 34, 74, 0.16), 0 13px 20px rgba(8, 34, 74, 0.14);
    }
  }
`;

const StyledFeatureIcon = styled.div.withConfig({
  displayName: 'StyledFeatureIcon',
  componentId: 'WelcomeEntry_StyledFeatureIcon',
})`
  width: ${({ theme }) => theme.spacing.lg + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.lg + theme.spacing.xs}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}4D`};
  background: linear-gradient(
    180deg,
    ${({ theme }) => `${theme.colors.primary}24`} 0%,
    ${({ theme }) => `${theme.colors.primary}10`} 100%
  );
`;

const StyledFeatureCopy = styled.div.withConfig({
  displayName: 'StyledFeatureCopy',
  componentId: 'WelcomeEntry_StyledFeatureCopy',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledBody = styled.div.withConfig({
  displayName: 'StyledBody',
  componentId: 'WelcomeEntry_StyledBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const panelCardBase = css`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledActionPanel = styled.div.withConfig({
  displayName: 'StyledActionPanel',
  componentId: 'WelcomeEntry_StyledActionPanel',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
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

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    flex-direction: row;

    > * {
      width: auto;
      min-width: 0;
      flex: 1 1 0;
    }
  }
`;

const StyledActionsCard = styled.div.withConfig({
  displayName: 'StyledActionsCard',
  componentId: 'WelcomeEntry_StyledActionsCard',
})`
  position: relative;
  overflow: hidden;
  ${panelCardBase}
  border-color: ${({ theme }) => `${theme.colors.primary}52`};
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.colors.background.secondary} 0%,
    ${({ theme }) => theme.colors.background.primary} 100%
  );
  box-shadow: 0 2px 0 rgba(8, 34, 74, 0.14), 0 12px 20px rgba(8, 34, 74, 0.12);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid ${({ theme }) => `${theme.colors.primary}26`};
    pointer-events: none;
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
  StyledHeroBadge,
  StyledHeader,
  StyledResumeActions,
  StyledResumeCard,
  StyledResumeContent,
  StyledSignInButton,
  StyledVerifyEmailButton,
};
