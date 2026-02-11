/**
 * UserMfaFormScreen - Android
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
  Switch,
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
} from './UserMfaFormScreen.android.styles';
import useUserMfaFormScreen from './useUserMfaFormScreen';

const UserMfaFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    userId,
    setUserId,
    channel,
    setChannel,
    channelOptions,
    userOptions,
    userListLoading,
    userListError,
    userErrorMessage,
    hasUsers,
    isCreateBlocked,
    secret,
    setSecret,
    isEnabled,
    setIsEnabled,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    userMfa,
    onSubmit,
    onCancel,
    onGoToUsers,
    onRetryUsers,
    isSubmitDisabled,
  } = useUserMfaFormScreen();

  if (isEdit && !userMfa && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-mfa-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !userMfa) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('userMfa.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('userMfa.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="user-mfa-form-load-error"
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
      testID="user-mfa-form-user-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(userMfa));
  const showUserBlocked = !isEdit && !hasUsers;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="user-mfa-form-title">
          {isEdit ? t('userMfa.form.editTitle') : t('userMfa.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="user-mfa-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userMfa.form.submitErrorTitle')}
              description={errorMessage}
              testID="user-mfa-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('userMfa.form.userLabel')} testID="user-mfa-form-card">
          <StyledFormGrid>
            <StyledFullRow>
              <StyledFieldGroup>
                {userListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="user-mfa-form-user-loading"
                  />
                ) : userListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('userMfa.form.userLoadErrorTitle')}
                    description={userErrorMessage}
                    action={retryUsersAction}
                    testID="user-mfa-form-user-error"
                  />
                ) : !hasUsers ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('userMfa.form.noUsersMessage')}</Text>
                    <Text variant="body">{t('userMfa.form.createUserFirst')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToUsers}
                      accessibilityLabel={t('userMfa.form.goToUsers')}
                      accessibilityHint={t('userMfa.form.goToUsersHint')}
                      icon={<Icon glyph="→" size="xs" decorative />}
                      testID="user-mfa-form-go-to-users"
                    >
                      {t('userMfa.form.goToUsers')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('userMfa.form.userLabel')}
                    placeholder={t('userMfa.form.userPlaceholder')}
                    options={userOptions}
                    value={userId}
                    onValueChange={setUserId}
                    accessibilityLabel={t('userMfa.form.userLabel')}
                    accessibilityHint={t('userMfa.form.userHint')}
                    helperText={showUserBlocked ? t('userMfa.form.blockedMessage') : t('userMfa.form.userHint')}
                    required
                    disabled={isFormDisabled || isEdit}
                    testID="user-mfa-form-user"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFieldGroup>
              <Select
                label={t('userMfa.form.channelLabel')}
                placeholder={t('userMfa.form.channelPlaceholder')}
                options={channelOptions}
                value={channel}
                onValueChange={setChannel}
                accessibilityLabel={t('userMfa.form.channelLabel')}
                accessibilityHint={t('userMfa.form.channelHint')}
                helperText={t('userMfa.form.channelHint')}
                required
                disabled={isFormDisabled}
                testID="user-mfa-form-channel"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('userMfa.form.secretLabel')}
                placeholder={t('userMfa.form.secretPlaceholder')}
                value={secret}
                onChangeText={setSecret}
                accessibilityLabel={t('userMfa.form.secretLabel')}
                accessibilityHint={t('userMfa.form.secretHint')}
                helperText={isEdit ? t('userMfa.form.secretHintEdit') : t('userMfa.form.secretHint')}
                required={!isEdit}
                disabled={isFormDisabled}
                testID="user-mfa-form-secret"
              />
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <Switch
                  value={isEnabled}
                  onValueChange={setIsEnabled}
                  label={t('userMfa.form.enabledLabel')}
                  accessibilityLabel={t('userMfa.form.enabledLabel')}
                  accessibilityHint={t('userMfa.form.enabledHint')}
                  disabled={isFormDisabled}
                  testID="user-mfa-form-enabled"
                />
              </StyledFieldGroup>
            </StyledFullRow>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('userMfa.form.cancel')}
            accessibilityHint={t('userMfa.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="user-mfa-form-cancel"
            disabled={isLoading}
          >
            {t('userMfa.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('userMfa.form.submitEdit') : t('userMfa.form.submitCreate')}
            accessibilityHint={isEdit ? t('userMfa.form.submitEdit') : t('userMfa.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
            testID="user-mfa-form-submit"
          >
            {isEdit ? t('userMfa.form.submitEdit') : t('userMfa.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserMfaFormScreenAndroid;
