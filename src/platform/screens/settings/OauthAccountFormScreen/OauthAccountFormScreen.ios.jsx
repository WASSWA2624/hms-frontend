/**
 * OauthAccountFormScreen - iOS
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './OauthAccountFormScreen.ios.styles';
import useOauthAccountFormScreen from './useOauthAccountFormScreen';

const OauthAccountFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    userId,
    setUserId,
    provider,
    setProvider,
    providerUserId,
    setProviderUserId,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    expiresAt,
    setExpiresAt,
    isLoading,
    hasError,
    oauthAccount,
    onSubmit,
    onCancel,
  } = useOauthAccountFormScreen();

  if (isEdit && !oauthAccount && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="oauth-account-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !oauthAccount) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('oauthAccount.form.loadError')}
            action={(
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="oauth-account-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="oauth-account-form-title">
          {isEdit ? t('oauthAccount.form.editTitle') : t('oauthAccount.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('oauthAccount.form.userIdLabel')}
              placeholder={t('oauthAccount.form.userIdPlaceholder')}
              value={userId}
              onChangeText={setUserId}
              accessibilityLabel={t('oauthAccount.form.userIdLabel')}
              accessibilityHint={t('oauthAccount.form.userIdHint')}
              testID="oauth-account-form-user-id"
            />
          </StyledSection>
        )}

        <StyledSection>
          <TextField
            label={t('oauthAccount.form.providerLabel')}
            placeholder={t('oauthAccount.form.providerPlaceholder')}
            value={provider}
            onChangeText={setProvider}
            accessibilityLabel={t('oauthAccount.form.providerLabel')}
            accessibilityHint={t('oauthAccount.form.providerHint')}
            testID="oauth-account-form-provider"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('oauthAccount.form.providerUserIdLabel')}
            placeholder={t('oauthAccount.form.providerUserIdPlaceholder')}
            value={providerUserId}
            onChangeText={setProviderUserId}
            accessibilityLabel={t('oauthAccount.form.providerUserIdLabel')}
            accessibilityHint={t('oauthAccount.form.providerUserIdHint')}
            testID="oauth-account-form-provider-user-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('oauthAccount.form.accessTokenLabel')}
            placeholder={t('oauthAccount.form.accessTokenPlaceholder')}
            value={accessToken}
            onChangeText={setAccessToken}
            accessibilityLabel={t('oauthAccount.form.accessTokenLabel')}
            accessibilityHint={t('oauthAccount.form.accessTokenHint')}
            testID="oauth-account-form-access-token"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('oauthAccount.form.refreshTokenLabel')}
            placeholder={t('oauthAccount.form.refreshTokenPlaceholder')}
            value={refreshToken}
            onChangeText={setRefreshToken}
            accessibilityLabel={t('oauthAccount.form.refreshTokenLabel')}
            accessibilityHint={t('oauthAccount.form.refreshTokenHint')}
            testID="oauth-account-form-refresh-token"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('oauthAccount.form.expiresAtLabel')}
            placeholder={t('oauthAccount.form.expiresAtPlaceholder')}
            value={expiresAt}
            onChangeText={setExpiresAt}
            accessibilityLabel={t('oauthAccount.form.expiresAtLabel')}
            accessibilityHint={t('oauthAccount.form.expiresAtHint')}
            testID="oauth-account-form-expires-at"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('oauthAccount.form.cancel')}
            accessibilityHint={t('oauthAccount.form.cancelHint')}
            testID="oauth-account-form-cancel"
          >
            {t('oauthAccount.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('oauthAccount.form.submitEdit') : t('oauthAccount.form.submitCreate')}
            testID="oauth-account-form-submit"
          >
            {isEdit ? t('oauthAccount.form.submitEdit') : t('oauthAccount.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default OauthAccountFormScreenIOS;
