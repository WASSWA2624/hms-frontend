/**
 * ForgotPasswordScreen - Android
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
import useForgotPasswordScreen from './useForgotPasswordScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
} from './ForgotPasswordScreen.android.styles';

const ForgotPasswordScreenAndroid = () => {
  const { t } = useI18n();
  const {
    form,
    errors,
    isHydrating,
    isSubmitting,
    isSubmitted,
    submitError,
    submitBlockedReason,
    isSubmitDisabled,
    setFieldValue,
    handleSubmit,
    goToLogin,
    goToResetPassword,
  } = useForgotPasswordScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="forgot-password-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');

  return (
    <StyledContainer>
      <StyledForm>
        <StyledField>
          <TextField
            label={t('auth.forgotPassword.fields.email.label')}
            placeholder={t('auth.forgotPassword.fields.email.placeholder')}
            value={form.email}
            onChangeText={(value) => setFieldValue('email', value)}
            errorMessage={errors.email}
            validationState={getValidationState('email')}
            helperText={t('auth.forgotPassword.fields.email.hint')}
            type="email"
            maxLength={320}
            density="compact"
            required
            testID="forgot-password-email"
          />
        </StyledField>

        <StyledField>
          <TextField
            label={t('auth.forgotPassword.fields.tenant.label')}
            placeholder={t('auth.forgotPassword.fields.tenant.placeholder')}
            value={form.tenant_id}
            onChangeText={(value) => setFieldValue('tenant_id', value)}
            errorMessage={errors.tenant_id}
            validationState={getValidationState('tenant_id')}
            helperText={t('auth.forgotPassword.fields.tenant.hint')}
            maxLength={64}
            density="compact"
            required
            testID="forgot-password-tenant"
          />
        </StyledField>

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            accessibilityLabel={t('auth.forgotPassword.buttonHint')}
            accessibilityHint={isSubmitDisabled && submitBlockedReason ? submitBlockedReason : undefined}
            testID="forgot-password-submit"
          >
            {t('auth.forgotPassword.button')}
          </Button>

          <Button
            variant="text"
            size="small"
            onPress={goToResetPassword}
            accessibilityLabel={t('auth.forgotPassword.actions.resetHint')}
            testID="forgot-password-reset"
          >
            {t('auth.forgotPassword.actions.reset')}
          </Button>

          <Button
            variant="text"
            size="small"
            onPress={goToLogin}
            accessibilityLabel={t('auth.forgotPassword.actions.loginHint')}
            testID="forgot-password-login"
          >
            {t('auth.forgotPassword.actions.login')}
          </Button>
        </StyledActions>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.forgotPassword.error.title')}
            description={submitError.message}
            testID="forgot-password-submit-error"
          />
        ) : null}
        {isSubmitted ? (
          <Text variant="caption" testID="forgot-password-success">
            {t('auth.forgotPassword.success.message')}
          </Text>
        ) : null}
        {!isSubmitted && !submitError && submitBlockedReason ? (
          <Text variant="caption" testID="forgot-password-submit-reason">
            {submitBlockedReason}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default ForgotPasswordScreenAndroid;

