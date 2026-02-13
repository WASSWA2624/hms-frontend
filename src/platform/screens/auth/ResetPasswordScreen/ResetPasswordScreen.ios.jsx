/**
 * ResetPasswordScreen - iOS
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
import useResetPasswordScreen from './useResetPasswordScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
} from './ResetPasswordScreen.ios.styles';

const ResetPasswordScreenIOS = () => {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
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
  } = useResetPasswordScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="reset-password-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');
  const togglePasswordLabel = showPassword
    ? t('auth.register.onboarding.actions.hidePassword')
    : t('auth.register.onboarding.actions.showPassword');
  const toggleConfirmPasswordLabel = showConfirmPassword
    ? t('auth.register.onboarding.actions.hidePassword')
    : t('auth.register.onboarding.actions.showPassword');

  return (
    <StyledContainer>
      <StyledForm>
        <StyledField>
          <TextField
            label={t('auth.resetPassword.fields.token.label')}
            placeholder={t('auth.resetPassword.fields.token.placeholder')}
            value={form.token}
            onChangeText={(value) => setFieldValue('token', value)}
            errorMessage={errors.token}
            validationState={getValidationState('token')}
            helperText={t('auth.resetPassword.fields.token.hint')}
            maxLength={512}
            density="compact"
            required
            testID="reset-password-token"
          />
        </StyledField>

        <StyledField>
          <TextField
            label={t('auth.resetPassword.fields.password.label')}
            placeholder={t('auth.resetPassword.fields.password.placeholder')}
            value={form.new_password}
            onChangeText={(value) => setFieldValue('new_password', value)}
            errorMessage={errors.new_password}
            validationState={getValidationState('new_password')}
            helperText={t('auth.resetPassword.fields.password.hint')}
            type="password"
            secureTextEntry={!showPassword}
            maxLength={128}
            density="compact"
            required
            suffix={(
              <Button
                variant="text"
                size="small"
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityLabel={togglePasswordLabel}
                testID="reset-password-toggle"
              >
                {togglePasswordLabel}
              </Button>
            )}
            testID="reset-password-new"
          />
        </StyledField>

        <StyledField>
          <TextField
            label={t('auth.resetPassword.fields.confirm.label')}
            placeholder={t('auth.resetPassword.fields.confirm.placeholder')}
            value={form.confirm_password}
            onChangeText={(value) => setFieldValue('confirm_password', value)}
            errorMessage={errors.confirm_password}
            validationState={getValidationState('confirm_password')}
            helperText={t('auth.resetPassword.fields.confirm.hint')}
            type="password"
            secureTextEntry={!showConfirmPassword}
            maxLength={128}
            density="compact"
            required
            suffix={(
              <Button
                variant="text"
                size="small"
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                accessibilityLabel={toggleConfirmPasswordLabel}
                testID="reset-confirm-password-toggle"
              >
                {toggleConfirmPasswordLabel}
              </Button>
            )}
            testID="reset-password-confirm"
          />
        </StyledField>

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            accessibilityLabel={t('auth.resetPassword.buttonHint')}
            accessibilityHint={isSubmitDisabled && submitBlockedReason ? submitBlockedReason : undefined}
            testID="reset-password-submit"
          >
            {t('auth.resetPassword.button')}
          </Button>

          <Button
            variant="text"
            size="small"
            onPress={goToLogin}
            accessibilityLabel={t('auth.resetPassword.actions.loginHint')}
            testID="reset-password-login"
          >
            {t('auth.resetPassword.actions.login')}
          </Button>
        </StyledActions>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.resetPassword.error.title')}
            description={submitError.message}
            testID="reset-password-submit-error"
          />
        ) : null}
        {isSubmitted ? (
          <Text variant="caption" testID="reset-password-success">
            {t('auth.resetPassword.success.message')}
          </Text>
        ) : null}
        {!isSubmitted && !submitError && submitBlockedReason ? (
          <Text variant="caption" testID="reset-password-submit-reason">
            {submitBlockedReason}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default ResetPasswordScreenIOS;

