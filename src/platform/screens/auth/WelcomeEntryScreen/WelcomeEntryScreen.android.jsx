/**
 * WelcomeEntryScreen - Android
 */
import React from 'react';
import { Button, Card, LoadingSpinner, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useWelcomeEntryScreen from './useWelcomeEntryScreen';
import {
  StyledActions,
  StyledContainer,
  StyledHeader,
  StyledResumeActions,
  StyledResumeCard,
  StyledResumeContent,
} from './WelcomeEntryScreen.android.styles';

const WelcomeEntryScreenAndroid = () => {
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

  return (
    <StyledContainer>
      <StyledHeader>
        <Text variant="h3">{t('auth.welcome.title')}</Text>
        <Text variant="body">{t('auth.welcome.description')}</Text>
      </StyledHeader>
      {resume ? (
        <StyledResumeCard>
          <Card variant="outlined" testID="welcome-resume-card">
            <StyledResumeContent>
              <Text variant="label">{t('auth.welcome.resume.title')}</Text>
              <Text variant="body">
                {t('auth.welcome.resume.description', { identifier: resume.maskedIdentifier })}
              </Text>
              <StyledResumeActions>
                <Button
                  variant="primary"
                  size="small"
                  onPress={continueFromLast}
                  accessibilityLabel={t(`auth.welcome.resume.actions.${resume.action}Hint`)}
                  testID="welcome-resume-continue"
                >
                  {t(`auth.welcome.resume.actions.${resume.action}`)}
                </Button>
                <Button
                  variant="text"
                  size="small"
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
        <Button
          variant="primary"
          size="small"
          onPress={goToSignIn}
          accessibilityLabel={t('auth.welcome.actions.signInHint')}
          testID="welcome-entry-signin"
        >
          {t('auth.welcome.actions.signIn')}
        </Button>
        <Button
          variant="surface"
          size="small"
          onPress={goToCreateAccount}
          accessibilityLabel={t('auth.welcome.actions.createAccountHint')}
          testID="welcome-entry-create"
        >
          {t('auth.welcome.actions.createAccount')}
        </Button>
        <Button
          variant="text"
          size="small"
          onPress={goToVerifyEmail}
          accessibilityLabel={t('auth.welcome.actions.verifyEmailHint')}
          testID="welcome-entry-verify-email"
        >
          {t('auth.welcome.actions.verifyEmail')}
        </Button>
      </StyledActions>
    </StyledContainer>
  );
};

export default WelcomeEntryScreenAndroid;
