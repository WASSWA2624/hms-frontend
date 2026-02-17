/**
 * ForgotPasswordScreen - Android
 */
import React from 'react';
import {
  Button,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Select,
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
    tenantOptions,
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

        {tenantOptions.length > 1 ? (
          <StyledField>
            <Select
              label={t('auth.forgotPassword.fields.tenant.label')}
              options={tenantOptions}
              value={form.tenant_id}
              onValueChange={(value) => setFieldValue('tenant_id', value)}
              placeholder={t('auth.forgotPassword.fields.tenant.placeholder')}
              errorMessage={errors.tenant_id}
              validationState={getValidationState('tenant_id')}
              helperText={t('auth.forgotPassword.fields.tenant.hint')}
              compact
              required
              testID="forgot-password-tenant"
            />
          </StyledField>
        ) : null}

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
