/**
 * WelcomeEntryScreen - iOS
 */
import React from 'react';
import { Button } from '@platform/components';
import { useI18n } from '@hooks';
import useWelcomeEntryScreen from './useWelcomeEntryScreen';
import {
  StyledActionPanel,
  StyledActions,
  StyledActionsCard,
  StyledBody,
  StyledContainer,
  StyledCreateAccountButton,
  StyledSignInButton,
} from './WelcomeEntryScreen.ios.styles';

const WelcomeEntryScreenIOS = () => {
  const { t } = useI18n();
  const {
    goToSignIn,
    goToCreateAccount,
  } = useWelcomeEntryScreen();

  return (
    <StyledContainer>
      <StyledBody>
        <StyledActionPanel>
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
            </StyledActions>
          </StyledActionsCard>
        </StyledActionPanel>
      </StyledBody>
    </StyledContainer>
  );
};

export default WelcomeEntryScreenIOS;
