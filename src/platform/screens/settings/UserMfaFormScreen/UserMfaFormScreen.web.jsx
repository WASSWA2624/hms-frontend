/**
 * UserMfaFormScreen - Web
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Select,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './UserMfaFormScreen.web.styles';
import useUserMfaFormScreen from './useUserMfaFormScreen';

const UserMfaFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    userId,
    setUserId,
    channel,
    setChannel,
    channelOptions,
    secret,
    setSecret,
    isEnabled,
    setIsEnabled,
    isLoading,
    hasError,
    userMfa,
    onSubmit,
    onCancel,
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
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="user-mfa-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="user-mfa-form-title">
          {isEdit ? t('userMfa.form.editTitle') : t('userMfa.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('userMfa.form.userIdLabel')}
              placeholder={t('userMfa.form.userIdPlaceholder')}
              value={userId}
              onChangeText={setUserId}
              accessibilityLabel={t('userMfa.form.userIdLabel')}
              accessibilityHint={t('userMfa.form.userIdHint')}
              testID="user-mfa-form-user-id"
            />
          </StyledSection>
        )}

        <StyledSection>
          <Select
            label={t('userMfa.form.channelLabel')}
            placeholder={t('userMfa.form.channelPlaceholder')}
            options={channelOptions}
            value={channel}
            onValueChange={setChannel}
            accessibilityLabel={t('userMfa.form.channelLabel')}
            accessibilityHint={t('userMfa.form.channelHint')}
            testID="user-mfa-form-channel"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userMfa.form.secretLabel')}
            placeholder={t('userMfa.form.secretPlaceholder')}
            value={secret}
            onChangeText={setSecret}
            accessibilityLabel={t('userMfa.form.secretLabel')}
            accessibilityHint={t('userMfa.form.secretHint')}
            testID="user-mfa-form-secret"
          />
        </StyledSection>

        <StyledSection>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            label={t('userMfa.form.enabledLabel')}
            accessibilityLabel={t('userMfa.form.enabledLabel')}
            accessibilityHint={t('userMfa.form.enabledHint')}
            testID="user-mfa-form-enabled"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('userMfa.form.cancel')}
            accessibilityHint={t('userMfa.form.cancelHint')}
            testID="user-mfa-form-cancel"
          >
            {t('userMfa.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('userMfa.form.submitEdit') : t('userMfa.form.submitCreate')}
            testID="user-mfa-form-submit"
          >
            {isEdit ? t('userMfa.form.submitEdit') : t('userMfa.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserMfaFormScreenWeb;
