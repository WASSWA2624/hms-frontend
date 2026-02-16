/**
 * LoginScreen - Web
 */
import React from 'react';
import {
  Button,
  Checkbox,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useLoginScreen from './useLoginScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledFormPanel,
  StyledForm,
  StyledInlineError,
  StyledLinks,
  StyledRemember,
  StyledTerms,
  StyledTermsLink,
} from './LoginScreen.web.styles';

const LoginScreenWeb = () => {
  const { t } = useI18n();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const {
    form,
    tenantOptions,
    errors,
    isHydrating,
    isSubmitting,
    submitError,
    setFieldValue,
    toggleRememberSession,
    toggleTermsAcceptance,
    handleSubmit,
    goToRegister,
    goToVerifyEmail,
    goToForgotPassword,
    goToTerms,
  } = useLoginScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="login-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');
  const togglePasswordLabel = isPasswordVisible
    ? t('auth.register.onboarding.actions.hidePassword')
    : t('auth.register.onboarding.actions.showPassword');

  return (
    <StyledContainer role="region" aria-label={t('auth.login.title')}>
      <StyledForm
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <StyledFormPanel>
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

          {tenantOptions.length > 1 ? (
            <StyledField>
              <Select
                label={t('auth.login.fields.tenant.label')}
                options={tenantOptions}
                value={form.tenant_id}
                onValueChange={(value) => setFieldValue('tenant_id', value)}
                placeholder={t('auth.login.fields.tenant.placeholder')}
                errorMessage={errors.tenant_id}
                validationState={getValidationState('tenant_id')}
                helperText={t('auth.login.fields.tenant.hint')}
                compact
                required
                testID="login-tenant"
              />
            </StyledField>
          ) : null}

          <StyledField>
            <TextField
              label={t('auth.login.fields.password.label')}
              placeholder={t('auth.login.fields.password.placeholder')}
              value={form.password}
              onChangeText={(value) => setFieldValue('password', value)}
              errorMessage={errors.password}
              validationState={getValidationState('password')}
              helperText={t('auth.login.fields.password.hint')}
              type={isPasswordVisible ? 'text' : 'password'}
              maxLength={128}
              density="compact"
              suffix={
                <Button
                  variant="text"
                  size="small"
                  type="button"
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

          <StyledTerms>
            <Checkbox
              checked={form.termsAccepted}
              onChange={toggleTermsAcceptance}
              label={t('auth.layout.termsAcceptance.label')}
              accessibilityHint={t('auth.layout.termsAcceptance.hint')}
              testID="login-terms-checkbox"
            />
            <StyledTermsLink>
              <Button
                variant="text"
                size="small"
                type="button"
                onPress={goToTerms}
                accessibilityLabel={t('auth.layout.termsAcceptance.openTerms')}
                accessibilityHint={t('auth.layout.termsAcceptance.openTermsHint')}
                testID="login-terms-link"
              >
                {t('auth.layout.termsAcceptance.openTerms')}
              </Button>
            </StyledTermsLink>
            {errors.termsAccepted ? (
              <Text variant="caption" color="error" testID="login-terms-error">
                {errors.termsAccepted}
              </Text>
            ) : null}
          </StyledTerms>

          {submitError ? (
            <StyledInlineError>
              <ErrorState
                size={ErrorStateSizes.SMALL}
                title={t('auth.login.error.title')}
                description={submitError.message}
                testID="login-submit-error"
              />
            </StyledInlineError>
          ) : null}

          <StyledActions>
            <Button
              variant="primary"
              size="small"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || !form.termsAccepted}
              accessibilityLabel={t('auth.login.buttonHint')}
              testID="login-submit"
            >
              {t('auth.login.button')}
            </Button>
          </StyledActions>
        </StyledFormPanel>

        <StyledLinks>
          <Button
            variant="text"
            size="small"
            type="button"
            onPress={goToForgotPassword}
            accessibilityLabel={t('auth.login.actions.forgotPasswordHint')}
            testID="login-forgot-password-link"
          >
            {t('auth.login.actions.forgotPassword')}
          </Button>
          <Button
            variant="text"
            size="small"
            type="button"
            onPress={goToRegister}
            accessibilityLabel={t('auth.login.actions.registerHint')}
            testID="login-register-link"
          >
            {t('auth.login.actions.register')}
          </Button>
          <Button
            variant="text"
            size="small"
            type="button"
            onPress={goToVerifyEmail}
            accessibilityLabel={t('auth.login.actions.verifyEmailHint')}
            testID="login-verify-email-link"
          >
            {t('auth.login.actions.verifyEmail')}
          </Button>
        </StyledLinks>
      </StyledForm>
    </StyledContainer>
  );
};

export default LoginScreenWeb;
