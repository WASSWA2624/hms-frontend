/**
 * WelcomeEntryScreen - Web
 */
import React, { useCallback, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { Button, Card, Icon, LoadingSpinner, Text } from '@platform/components';
import { useI18n } from '@hooks';
import breakpoints from '@theme/breakpoints';
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
} from './WelcomeEntryScreen.web.styles';

const MOBILE_SWIPE_THRESHOLD = 48;

const WelcomeEntryScreenWeb = () => {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const {
    isHydrating,
    resume,
    goToSignIn,
    goToCreateAccount,
    goToVerifyEmail,
    continueFromLast,
    dismissResume,
  } = useWelcomeEntryScreen();
  const swipeStartRef = useRef({ x: 0, y: 0 });

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

  const isMobileWeb = width < breakpoints.tablet;
  const {
    visibleItems: visibleReasons,
    goNext: goNextReason,
    goPrevious: goPreviousReason,
    isCarouselEnabled,
  } = useReasonCarousel(reasons, {
    enabled: isMobileWeb,
    visibleCount: 2,
    stepIntervalMs: 15000,
  });

  const shouldHandleSwipe = isMobileWeb && isCarouselEnabled;

  const handleTouchStart = useCallback((event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;

    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = touch.clientY - swipeStartRef.current.y;
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX)
      && Math.abs(deltaY) >= MOBILE_SWIPE_THRESHOLD;

    if (!isVerticalSwipe) return;
    if (deltaY < 0) {
      goNextReason();
      return;
    }
    goPreviousReason();
  }, [goNextReason, goPreviousReason]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="welcome-entry-loading" />;
  }

  return (
    <StyledContainer role="region" aria-label={t('auth.welcome.title')}>
      <StyledHero>
        <StyledAudiencePills>
          {audiences.map((audience) => (
            <StyledAudiencePill key={audience.key}>
              <StyledAudiencePillIcon>
                <Icon glyph={audience.icon} size="sm" tone="primary" decorative />
              </StyledAudiencePillIcon>
              <StyledAudiencePillLabel>{audience.label}</StyledAudiencePillLabel>
            </StyledAudiencePill>
          ))}
        </StyledAudiencePills>

        <StyledFeatureGrid
          onTouchStart={shouldHandleSwipe ? handleTouchStart : undefined}
          onTouchEnd={shouldHandleSwipe ? handleTouchEnd : undefined}
        >
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

export default WelcomeEntryScreenWeb;
