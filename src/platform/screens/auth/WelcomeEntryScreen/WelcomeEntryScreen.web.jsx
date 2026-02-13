/**
 * WelcomeEntryScreen - Web
 */
import React from 'react';
import { Button, Card, Icon, LoadingSpinner, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useWelcomeEntryScreen from './useWelcomeEntryScreen';
import {
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
} from './WelcomeEntryScreen.web.styles';

const WelcomeEntryScreenWeb = () => {
  const { t } = useI18n();
  const {
    isHydrating,
    resume,
    goToSignIn,
    goToCreateAccount,
    goToVerifyEmail,
    continueFromLast,
    dismissResume,
  } = useWelcomeEntryScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="welcome-entry-loading" />;
  }

  const pathways = [
    {
      key: 'sign-in',
      label: t('auth.welcome.actions.signIn'),
      hint: t('auth.welcome.actions.signInHint'),
    },
    {
      key: 'create-account',
      label: t('auth.welcome.actions.createAccount'),
      hint: t('auth.welcome.actions.createAccountHint'),
    },
    {
      key: 'verify-email',
      label: t('auth.welcome.actions.verifyEmail'),
      hint: t('auth.welcome.actions.verifyEmailHint'),
    },
  ];

  const reasons = [
    {
      key: 'secure-access',
      icon: '\uD83D\uDD10',
      title: t('auth.welcome.reasons.items.secureAccess.title'),
      description: t('auth.welcome.reasons.items.secureAccess.description'),
    },
    {
      key: 'quick-setup',
      icon: '\u26A1',
      title: t('auth.welcome.reasons.items.quickSetup.title'),
      description: t('auth.welcome.reasons.items.quickSetup.description'),
    },
    {
      key: 'verified-identity',
      icon: '\u2705',
      title: t('auth.welcome.reasons.items.verifiedIdentity.title'),
      description: t('auth.welcome.reasons.items.verifiedIdentity.description'),
    },
    {
      key: 'resume-flow',
      icon: '\uD83D\uDD01',
      title: t('auth.welcome.reasons.items.resumeFlow.title'),
      description: t('auth.welcome.reasons.items.resumeFlow.description'),
    },
  ];

  return (
    <StyledContainer role="region" aria-label={t('auth.welcome.title')}>
      <StyledHero>
        <StyledHeroBadge>
          <Text variant="label" color="primary">
            {t('auth.welcome.reasons.badge')}
          </Text>
        </StyledHeroBadge>
        <StyledHeader>
          <Text variant="body" color="text.secondary">
            {t('auth.welcome.reasons.description')}
          </Text>
        </StyledHeader>
        <StyledFeatureGrid>
          {reasons.map((reason) => (
            <StyledFeatureCard key={reason.key}>
              <StyledFeatureIcon>
                <Icon glyph={reason.icon} size="md" tone="primary" decorative />
              </StyledFeatureIcon>
              <StyledFeatureCopy>
                <Text variant="label">{reason.title}</Text>
                <Text variant="caption" color="text.secondary">
                  {reason.description}
                </Text>
              </StyledFeatureCopy>
            </StyledFeatureCard>
          ))}
        </StyledFeatureGrid>
      </StyledHero>

      <StyledBody>
        <StyledJourneyPanel>
          {pathways.map((pathway, index) => (
            <StyledJourneyCard key={pathway.key}>
              <StyledJourneyIndex>
                <Text variant="caption" color="text.inverse">
                  {index + 1}
                </Text>
              </StyledJourneyIndex>
              <StyledJourneyCopy>
                <Text variant="label">{pathway.label}</Text>
                <Text variant="caption" color="text.secondary">
                  {pathway.hint}
                </Text>
              </StyledJourneyCopy>
            </StyledJourneyCard>
          ))}
        </StyledJourneyPanel>

        <StyledActionPanel>
          {resume ? (
            <StyledResumeCard>
              <Card variant="outlined" testID="welcome-resume-card">
                <StyledResumeContent>
                  <Text variant="label">{t('auth.welcome.resume.title')}</Text>
                  <Text variant="body" color="text.secondary">
                    {t('auth.welcome.resume.description', { identifier: resume.maskedIdentifier })}
                  </Text>
                  <StyledResumeActions>
                    <Button
                      variant="primary"
                      size="small"
                      type="button"
                      onPress={continueFromLast}
                      accessibilityLabel={t(`auth.welcome.resume.actions.${resume.action}Hint`)}
                      testID="welcome-resume-continue"
                    >
                      {t(`auth.welcome.resume.actions.${resume.action}`)}
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      type="button"
                      onPress={dismissResume}
                      accessibilityLabel={t('auth.welcome.resume.actions.dismissHint')}
                      testID="welcome-resume-dismiss"
                    >
                      {t('auth.welcome.resume.actions.dismiss')}
                    </Button>
                  </StyledResumeActions>
                </StyledResumeContent>
              </Card>
            </StyledResumeCard>
          ) : null}

          <StyledActions>
            <StyledSignInButton
              onPress={goToSignIn}
              accessibilityLabel={t('auth.welcome.actions.signInHint')}
              testID="welcome-entry-signin"
            >
              {t('auth.welcome.actions.signIn')}
            </StyledSignInButton>
            <StyledCreateAccountButton
              onPress={goToCreateAccount}
              accessibilityLabel={t('auth.welcome.actions.createAccountHint')}
              testID="welcome-entry-create"
            >
              {t('auth.welcome.actions.createAccount')}
            </StyledCreateAccountButton>
            <StyledVerifyEmailButton
              onPress={goToVerifyEmail}
              accessibilityLabel={t('auth.welcome.actions.verifyEmailHint')}
              testID="welcome-entry-verify-email"
            >
              {t('auth.welcome.actions.verifyEmail')}
            </StyledVerifyEmailButton>
          </StyledActions>
        </StyledActionPanel>
      </StyledBody>
    </StyledContainer>
  );
};

export default WelcomeEntryScreenWeb;
