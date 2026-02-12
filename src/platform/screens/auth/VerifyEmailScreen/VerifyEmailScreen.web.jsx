/**
 * VerifyEmailScreen - Web
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
} from './VerifyEmailScreen.web.styles';

const VerifyEmailScreenWeb = () => {
  const { t } = useI18n();
  const {
    form,
    errors,
    isHydrating,
    isVerifying,
    isResending,
    isVerified,
    submitError,
    resendMessage,
    setFieldValue,
    handleSubmit,
    handleResend,
    goToLogin,
  } = useVerifyEmailScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="verify-email-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');

  return (
    <StyledContainer role="region" aria-label={t('auth.verifyEmail.title')}>
      <StyledForm
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
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

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            type="submit"
            loading={isVerifying}
            disabled={isVerifying || isResending || isVerified}
            accessibilityLabel={t('auth.verifyEmail.buttonHint')}
            testID="verify-email-submit"
          >
            {t('auth.verifyEmail.button')}
          </Button>

          <Button
            variant="text"
            size="small"
            type="button"
            onPress={isVerified ? goToLogin : handleResend}
            loading={!isVerified && isResending}
            disabled={isVerifying || (!isVerified && isResending)}
            accessibilityLabel={isVerified ? t('auth.verifyEmail.actions.loginHint') : t('auth.verifyEmail.actions.resendHint')}
            testID="verify-email-resend"
          >
            {isVerified ? t('auth.verifyEmail.actions.login') : t('auth.verifyEmail.actions.resend')}
          </Button>
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

export default VerifyEmailScreenWeb;
