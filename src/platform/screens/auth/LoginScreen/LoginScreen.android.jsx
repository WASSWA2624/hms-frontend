/**
 * LoginScreen - Android
 */
import React from 'react';
import {
  Button,
  Checkbox,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useLoginScreen from './useLoginScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledLinks,
  StyledRemember,
  StyledStatus,
} from './LoginScreen.android.styles';

const LoginScreenAndroid = () => {
  const { t } = useI18n();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const {
    form,
    errors,
    isHydrating,
    isSubmitting,
    submitError,
    setFieldValue,
    toggleRememberSession,
    handleSubmit,
    goToRegister,
    goToVerifyEmail,
  } = useLoginScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="login-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');
  const togglePasswordLabel = isPasswordVisible
    ? t('auth.register.onboarding.actions.hidePassword')
    : t('auth.register.onboarding.actions.showPassword');

  return (
    <StyledContainer>
      <StyledForm>
        <StyledField>
          <TextField
            label={t('auth.login.fields.email.label')}
            placeholder={t('auth.login.fields.email.placeholder')}
            value={form.identifier}
            onChangeText={(value) => setFieldValue('identifier', value)}
            errorMessage={errors.identifier}
            validationState={getValidationState('identifier')}
            helperText={t('auth.login.fields.email.hint')}
            maxLength={320}
            density="compact"
            required
            testID="login-identifier"
          />
        </StyledField>

        <StyledField>
          <TextField
            label={t('auth.login.fields.password.label')}
            placeholder={t('auth.login.fields.password.placeholder')}
            value={form.password}
            onChangeText={(value) => setFieldValue('password', value)}
            errorMessage={errors.password}
            validationState={getValidationState('password')}
            helperText={t('auth.login.fields.password.hint')}
            type="password"
            secureTextEntry={!isPasswordVisible}
            maxLength={128}
            density="compact"
            suffix={
              <Button
                variant="text"
                size="small"
                onPress={() => setIsPasswordVisible((prev) => !prev)}
                accessibilityLabel={togglePasswordLabel}
                testID="login-password-toggle"
              >
                {togglePasswordLabel}
              </Button>
            }
            required
            testID="login-password"
          />
        </StyledField>

        <StyledRemember>
          <Checkbox
            checked={form.rememberSession}
            onChange={toggleRememberSession}
            label={t('auth.login.fields.remember.label')}
            accessibilityHint={t('auth.login.fields.remember.hint')}
            testID="login-remember-session"
          />
        </StyledRemember>

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            accessibilityLabel={t('auth.login.buttonHint')}
            testID="login-submit"
          >
            {t('auth.login.button')}
          </Button>
        </StyledActions>

        <StyledLinks>
          <Button
            variant="text"
            size="small"
            onPress={goToRegister}
            accessibilityLabel={t('auth.login.actions.registerHint')}
            testID="login-register-link"
          >
            {t('auth.login.actions.register')}
          </Button>
          <Button
            variant="text"
            size="small"
            onPress={goToVerifyEmail}
            accessibilityLabel={t('auth.login.actions.verifyEmailHint')}
            testID="login-verify-email-link"
          >
            {t('auth.login.actions.verifyEmail')}
          </Button>
        </StyledLinks>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.login.error.title')}
            description={submitError.message}
            testID="login-submit-error"
          />
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default LoginScreenAndroid;

