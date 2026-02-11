/**
 * OauthAccountFormScreen - iOS
 */
import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledHelperStack,
  StyledInlineStates,
} from './OauthAccountFormScreen.ios.styles';
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
    userOptions,
    userListLoading,
    userListError,
    userErrorMessage,
    hasUsers,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    oauthAccount,
    onSubmit,
    onCancel,
    onGoToUsers,
    onRetryUsers,
    isSubmitDisabled,
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
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('oauthAccount.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="oauth-account-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && isCreateBlocked);
  const retryUsersAction = onRetryUsers ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryUsers}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="oauth-account-form-user-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(oauthAccount));
  const showUserBlocked = !isEdit && !hasUsers;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="oauth-account-form-title">
          {isEdit ? t('oauthAccount.form.editTitle') : t('oauthAccount.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="oauth-account-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('oauthAccount.form.submitErrorTitle')}
              description={errorMessage}
              testID="oauth-account-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('oauthAccount.form.userLabel')} testID="oauth-account-form-card">
          <StyledFormGrid>
            <StyledFullRow>
              <StyledFieldGroup>
                {userListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="oauth-account-form-user-loading"
                  />
                ) : userListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('oauthAccount.form.userLoadErrorTitle')}
                    description={userErrorMessage}
                    action={retryUsersAction}
                    testID="oauth-account-form-user-error"
                  />
                ) : !hasUsers ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('oauthAccount.form.noUsersMessage')}</Text>
                    <Text variant="body">{t('oauthAccount.form.createUserFirst')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToUsers}
                      accessibilityLabel={t('oauthAccount.form.goToUsers')}
                      accessibilityHint={t('oauthAccount.form.goToUsersHint')}
                      icon={<Icon glyph="→" size="xs" decorative />}
                      testID="oauth-account-form-go-to-users"
                    >
                      {t('oauthAccount.form.goToUsers')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('oauthAccount.form.userLabel')}
                    placeholder={t('oauthAccount.form.userPlaceholder')}
                    options={userOptions}
                    value={userId}
                    onValueChange={setUserId}
                    accessibilityLabel={t('oauthAccount.form.userLabel')}
                    accessibilityHint={t('oauthAccount.form.userHint')}
                    helperText={showUserBlocked ? t('oauthAccount.form.blockedMessage') : t('oauthAccount.form.userHint')}
                    required
                    disabled={isFormDisabled || isEdit}
                    testID="oauth-account-form-user"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFieldGroup>
              <TextField
                label={t('oauthAccount.form.providerLabel')}
                placeholder={t('oauthAccount.form.providerPlaceholder')}
                value={provider}
                onChangeText={setProvider}
                accessibilityLabel={t('oauthAccount.form.providerLabel')}
                accessibilityHint={t('oauthAccount.form.providerHint')}
                helperText={t('oauthAccount.form.providerHint')}
                required
                disabled={isFormDisabled}
                testID="oauth-account-form-provider"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('oauthAccount.form.providerUserIdLabel')}
                placeholder={t('oauthAccount.form.providerUserIdPlaceholder')}
                value={providerUserId}
                onChangeText={setProviderUserId}
                accessibilityLabel={t('oauthAccount.form.providerUserIdLabel')}
                accessibilityHint={t('oauthAccount.form.providerUserIdHint')}
                helperText={t('oauthAccount.form.providerUserIdHint')}
                required
                disabled={isFormDisabled}
                testID="oauth-account-form-provider-user-id"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('oauthAccount.form.accessTokenLabel')}
                placeholder={t('oauthAccount.form.accessTokenPlaceholder')}
                value={accessToken}
                onChangeText={setAccessToken}
                accessibilityLabel={t('oauthAccount.form.accessTokenLabel')}
                accessibilityHint={t('oauthAccount.form.accessTokenHint')}
                helperText={t('oauthAccount.form.accessTokenHint')}
                testID="oauth-account-form-access-token"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('oauthAccount.form.refreshTokenLabel')}
                placeholder={t('oauthAccount.form.refreshTokenPlaceholder')}
                value={refreshToken}
                onChangeText={setRefreshToken}
                accessibilityLabel={t('oauthAccount.form.refreshTokenLabel')}
                accessibilityHint={t('oauthAccount.form.refreshTokenHint')}
                helperText={t('oauthAccount.form.refreshTokenHint')}
                testID="oauth-account-form-refresh-token"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('oauthAccount.form.expiresAtLabel')}
                placeholder={t('oauthAccount.form.expiresAtPlaceholder')}
                value={expiresAt}
                onChangeText={setExpiresAt}
                accessibilityLabel={t('oauthAccount.form.expiresAtLabel')}
                accessibilityHint={t('oauthAccount.form.expiresAtHint')}
                helperText={t('oauthAccount.form.expiresAtHint')}
                testID="oauth-account-form-expires-at"
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>
        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('oauthAccount.form.cancel')}
            accessibilityHint={t('oauthAccount.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="oauth-account-form-cancel"
            disabled={isLoading}
          >
            {t('oauthAccount.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('oauthAccount.form.submitEdit') : t('oauthAccount.form.submitCreate')}
            accessibilityHint={isEdit ? t('oauthAccount.form.submitEdit') : t('oauthAccount.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
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
