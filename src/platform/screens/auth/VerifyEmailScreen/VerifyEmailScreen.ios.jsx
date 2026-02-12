/**
 * VerifyEmailScreen - iOS
 */
import React from 'react';
import {
  Button,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useVerifyEmailScreen from './useVerifyEmailScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
} from './VerifyEmailScreen.ios.styles';

const VerifyEmailScreenIOS = () => {
  const { t } = useI18n();
  const {
    form,
    errors,
    useManualCode,
    isHydrating,
    isVerifying,
    isResending,
    isVerified,
    submitError,
    resendMessage,
    setFieldValue,
    handleSubmit,
    handleResend,
    setUseManualCode,
    goToLogin,
  } = useVerifyEmailScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="verify-email-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');

  return (
    <StyledContainer>
      <StyledForm>
        <StyledField>
          <TextField
            label={t('auth.verifyEmail.fields.email.label')}
            placeholder={t('auth.verifyEmail.fields.email.placeholder')}
            value={form.email}
            onChangeText={(value) => setFieldValue('email', value)}
            errorMessage={errors.email}
            validationState={getValidationState('email')}
            helperText={t('auth.verifyEmail.fields.email.hint')}
            type="email"
            maxLength={320}
            density="compact"
            required
            testID="verify-email-address"
          />
        </StyledField>

        {useManualCode ? (
          <StyledField>
            <TextField
              label={t('auth.verifyEmail.fields.token.label')}
              placeholder={t('auth.verifyEmail.fields.token.placeholder')}
              value={form.token}
              onChangeText={(value) => setFieldValue('token', value)}
              errorMessage={errors.token}
              validationState={getValidationState('token')}
              helperText={t('auth.verifyEmail.fields.token.hint')}
              maxLength={64}
              density="compact"
              required
              testID="verify-email-token"
            />
          </StyledField>
        ) : null}

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            onPress={handleSubmit}
            loading={useManualCode ? isVerifying : isResending}
            disabled={isVerifying || isResending || isVerified}
            accessibilityLabel={useManualCode ? t('auth.verifyEmail.buttonHint') : t('auth.verifyEmail.actions.resendHint')}
            testID="verify-email-submit"
          >
            {useManualCode ? t('auth.verifyEmail.button') : t('auth.verifyEmail.actions.resend')}
          </Button>
          <Button
            variant="text"
            size="small"
            onPress={isVerified ? goToLogin : (useManualCode ? () => setUseManualCode(false) : () => setUseManualCode(true))}
            disabled={isResending || isVerifying}
            accessibilityLabel={
              isVerified
                ? t('auth.verifyEmail.actions.loginHint')
                : useManualCode
                ? 'Use magic link instead'
                : 'Enter verification code manually'
            }
            testID="verify-email-resend"
          >
            {isVerified
              ? t('auth.verifyEmail.actions.login')
              : useManualCode
              ? 'Use magic link instead'
              : 'Enter code manually'}
          </Button>
          {!isVerified ? (
            <Button
              variant="text"
              size="small"
              onPress={handleResend}
              loading={isResending}
              disabled={isResending || isVerifying}
              accessibilityLabel={t('auth.verifyEmail.actions.resendHint')}
              testID="verify-email-resend-direct"
            >
              {t('auth.verifyEmail.actions.resend')}
            </Button>
          ) : null}
        </StyledActions>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.verifyEmail.error.title')}
            description={submitError.message}
            testID="verify-email-submit-error"
          />
        ) : null}
        {resendMessage ? (
          <Text variant="caption" testID="verify-email-resend-message">
            {resendMessage}
          </Text>
        ) : null}
        {isVerified ? (
          <Text variant="caption" testID="verify-email-success">
            {t('auth.verifyEmail.success.message')}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default VerifyEmailScreenIOS;
