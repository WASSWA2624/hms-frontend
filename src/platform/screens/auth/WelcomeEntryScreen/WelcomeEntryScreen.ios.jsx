/**
 * WelcomeEntryScreen - iOS
 */
import React, { useMemo } from 'react';
import { PanResponder } from 'react-native';
import { Button, Card, Icon, LoadingSpinner, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useWelcomeEntryScreen from './useWelcomeEntryScreen';
import useReasonCarousel from './useReasonCarousel';
import {
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
} from './WelcomeEntryScreen.ios.styles';

const SWIPE_THRESHOLD = 48;

const WelcomeEntryScreenIOS = () => {
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

  const reasons = [
    {
      key: 'secure-access',
      icon: '\uD83D\uDD10',
      title: t('auth.welcome.reasons.items.secureAccess.title'),
      description: t('auth.welcome.reasons.items.secureAccess.description'),
    },
    {
      key: 'quick-setup',
      icon: '\uD83E\uDE7A',
      title: t('auth.welcome.reasons.items.quickSetup.title'),
      description: t('auth.welcome.reasons.items.quickSetup.description'),
    },
    {
      key: 'verified-identity',
      icon: '\uD83C\uDFE5',
      title: t('auth.welcome.reasons.items.verifiedIdentity.title'),
      description: t('auth.welcome.reasons.items.verifiedIdentity.description'),
    },
    {
      key: 'resume-flow',
      icon: '\uD83D\uDCC8',
      title: t('auth.welcome.reasons.items.resumeFlow.title'),
      description: t('auth.welcome.reasons.items.resumeFlow.description'),
    },
  ];

  const audiences = [
    {
      key: 'clinicians',
      icon: '\uD83E\uDE7A',
      label: t('auth.welcome.reasons.audiences.clinicians'),
    },
    {
      key: 'admins',
      icon: '\uD83C\uDFE5',
      label: t('auth.welcome.reasons.audiences.admins'),
    },
    {
      key: 'investors',
      icon: '\uD83D\uDCC8',
      label: t('auth.welcome.reasons.audiences.investors'),
    },
  ];

  const {
    visibleItems: visibleReasons,
    goNext: goNextReason,
    goPrevious: goPreviousReason,
    isCarouselEnabled,
  } = useReasonCarousel(reasons, {
    enabled: true,
    visibleCount: 2,
    stepIntervalMs: 15000,
  });

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => (
      isCarouselEnabled
      && Math.abs(gestureState.dy) > 10
      && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
    ),
    onPanResponderRelease: (_, gestureState) => {
      if (
        !isCarouselEnabled
        || Math.abs(gestureState.dy) < SWIPE_THRESHOLD
        || Math.abs(gestureState.dy) <= Math.abs(gestureState.dx)
      ) {
        return;
      }

      if (gestureState.dy < 0) {
        goNextReason();
        return;
      }
      goPreviousReason();
    },
  }), [goNextReason, goPreviousReason, isCarouselEnabled]);

  if (isHydrating) {
    return (
      <LoadingSpinner
        accessibilityLabel={t('common.loading')}
        testID="welcome-entry-loading"
      />
    );
  }

  return (
    <StyledContainer>
      <StyledHero>
        <StyledAudiencePills>
          {audiences.map((audience) => (
            <StyledAudiencePill key={audience.key}>
              <StyledAudiencePillIcon>
                <Icon
                  glyph={audience.icon}
                  size="sm"
                  tone="primary"
                  decorative
                />
              </StyledAudiencePillIcon>
              <StyledAudiencePillLabel>
                {audience.label}
              </StyledAudiencePillLabel>
            </StyledAudiencePill>
          ))}
        </StyledAudiencePills>

        <StyledFeatureGrid {...(isCarouselEnabled ? panResponder.panHandlers : {})}>
          {visibleReasons.map((reason) => (
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
        <StyledActionPanel>
          {resume ? (
            <StyledResumeCard>
              <Card variant="outlined" testID="welcome-resume-card">
                <StyledResumeContent>
                  <Text variant="label">{t('auth.welcome.resume.title')}</Text>
                  <Text variant="body" color="text.secondary">
                    {t('auth.welcome.resume.description', {
                      identifier: resume.maskedIdentifier,
                    })}
                  </Text>
                  <StyledResumeActions>
                    <Button
                      variant="primary"
                      size="small"
                      onPress={continueFromLast}
                      accessibilityLabel={t(
                        `auth.welcome.resume.actions.${resume.action}Hint`
                      )}
                      testID="welcome-resume-continue"
                    >
                      {t(`auth.welcome.resume.actions.${resume.action}`)}
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onPress={dismissResume}
                      accessibilityLabel={t(
                        'auth.welcome.resume.actions.dismissHint'
                      )}
                      testID="welcome-resume-dismiss"
                    >
                      {t('auth.welcome.resume.actions.dismiss')}
                    </Button>
                  </StyledResumeActions>
                </StyledResumeContent>
              </Card>
            </StyledResumeCard>
          ) : null}

          <StyledActionsCard>
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
          </StyledActionsCard>
        </StyledActionPanel>
      </StyledBody>
    </StyledContainer>
  );
};

export default WelcomeEntryScreenIOS;
