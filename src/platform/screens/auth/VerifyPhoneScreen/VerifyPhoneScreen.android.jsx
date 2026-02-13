/**
 * VerifyPhoneScreen - Android
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
import useVerifyPhoneScreen from './useVerifyPhoneScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
} from './VerifyPhoneScreen.android.styles';

const VerifyPhoneScreenAndroid = () => {
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
    submitBlockedReason,
    isSubmitDisabled,
    setFieldValue,
    handleSubmit,
    handleResend,
    goToLogin,
  } = useVerifyPhoneScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="verify-phone-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');

  return (
    <StyledContainer>
      <StyledForm>
        <StyledField>
          <TextField
            label={t('auth.verifyPhone.fields.phone.label')}
            placeholder={t('auth.verifyPhone.fields.phone.placeholder')}
            value={form.phone}
            onChangeText={(value) => setFieldValue('phone', value)}
            errorMessage={errors.phone}
            validationState={getValidationState('phone')}
            helperText={t('auth.verifyPhone.fields.phone.hint')}
            maxLength={20}
            density="compact"
            required
            testID="verify-phone-number"
          />
        </StyledField>

        <StyledField>
          <TextField
            label={t('auth.verifyPhone.fields.token.label')}
            placeholder={t('auth.verifyPhone.fields.token.placeholder')}
            value={form.token}
            onChangeText={(value) => setFieldValue('token', value)}
            errorMessage={errors.token}
            validationState={getValidationState('token')}
            helperText={t('auth.verifyPhone.fields.token.hint')}
            maxLength={64}
            density="compact"
            required
            testID="verify-phone-token"
          />
        </StyledField>

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            onPress={handleSubmit}
            loading={isVerifying}
            disabled={isSubmitDisabled}
            accessibilityLabel={t('auth.verifyPhone.buttonHint')}
            accessibilityHint={isSubmitDisabled && submitBlockedReason ? submitBlockedReason : undefined}
            testID="verify-phone-submit"
          >
            {t('auth.verifyPhone.button')}
          </Button>

          <Button
            variant="text"
            size="small"
            onPress={isVerified ? goToLogin : handleResend}
            loading={!isVerified && isResending}
            disabled={isVerifying || (!isVerified && isResending)}
            accessibilityLabel={isVerified ? t('auth.verifyPhone.actions.loginHint') : t('auth.verifyPhone.actions.resendHint')}
            testID="verify-phone-resend"
          >
            {isVerified ? t('auth.verifyPhone.actions.login') : t('auth.verifyPhone.actions.resend')}
          </Button>
        </StyledActions>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.verifyPhone.error.title')}
            description={submitError.message}
            testID="verify-phone-submit-error"
          />
        ) : null}
        {resendMessage ? (
          <Text variant="caption" testID="verify-phone-resend-message">
            {resendMessage}
          </Text>
        ) : null}
        {isVerified ? (
          <Text variant="caption" testID="verify-phone-success">
            {t('auth.verifyPhone.success.message')}
          </Text>
        ) : null}
        {!isVerified && !submitError && submitBlockedReason ? (
          <Text variant="caption" testID="verify-phone-submit-reason">
            {submitBlockedReason}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default VerifyPhoneScreenAndroid;

