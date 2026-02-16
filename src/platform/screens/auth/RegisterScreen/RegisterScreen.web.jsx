/**
 * RegisterScreen - Web
 * Minimal signup step for onboarding.
 * File: RegisterScreen.web.jsx
 */
import React from 'react';
import {
  Button,
  Checkbox,
  EmptyState,
  EmptyStateSizes,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useRegisterScreen from './useRegisterScreen';
import {
  StyledActions,
  StyledContainer,
  StyledFieldGrid,
  StyledForm,
  StyledTerms,
  StyledTermsLink,
  StyledStatus,
} from './RegisterScreen.web.styles';

const RegisterScreenWeb = () => {
  const { t } = useI18n();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const {
    form,
    errors,
    isHydrating,
    isSubmitting,
    submitError,
    setFieldValue,
    toggleTermsAcceptance,
    handleSubmit,
    goToTerms,
    retryHydration,
    hasFacilityOptions,
  } = useRegisterScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="register-loading" />;
  }

  if (!hasFacilityOptions) {
    return (
      <EmptyState
        size={EmptyStateSizes.SMALL}
        title={t('auth.register.onboarding.empty.title')}
        description={t('auth.register.onboarding.empty.description')}
        action={
          <Button size="small" variant="surface" onPress={retryHydration}>
            {t('common.retry')}
          </Button>
        }
        testID="register-empty-state"
      />
    );
  }

  const primaryLabel = t('auth.register.onboarding.actions.createWorkspace');
  const passwordToggleLabel = isPasswordVisible
    ? t('auth.register.onboarding.actions.hidePassword')
    : t('auth.register.onboarding.actions.showPassword');
  const getValidationState = (field) => (errors[field] ? 'error' : 'default');

  return (
    <StyledContainer role="region" aria-label={t('auth.register.onboarding.layoutLabel')}>
      <StyledForm
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <StyledFieldGrid>
          <TextField
            label={t('auth.register.onboarding.fields.facilityName')}
            placeholder={t('auth.register.onboarding.placeholders.facilityName')}
            value={form.facilityName}
            onChangeText={(value) => setFieldValue('facilityName', value)}
            errorMessage={errors.facilityName}
            validationState={getValidationState('facilityName')}
            maxLength={255}
            density="compact"
            required
            testID="register-facility-name"
          />
          <TextField
            label={t('auth.register.onboarding.fields.adminName')}
            placeholder={t('auth.register.onboarding.placeholders.adminName')}
            value={form.adminName}
            onChangeText={(value) => setFieldValue('adminName', value)}
            errorMessage={errors.adminName}
            validationState={getValidationState('adminName')}
            maxLength={255}
            density="compact"
            required
            testID="register-admin-name"
          />
          <TextField
            label={t('auth.register.onboarding.fields.email')}
            placeholder={t('auth.register.onboarding.placeholders.email')}
            value={form.email}
            onChangeText={(value) => setFieldValue('email', value)}
            errorMessage={errors.email}
            validationState={getValidationState('email')}
            type="email"
            maxLength={320}
            density="compact"
            required
            testID="register-email"
          />
          <TextField
            label={t('auth.register.onboarding.fields.password')}
            placeholder={t('auth.register.onboarding.placeholders.password')}
            value={form.password}
            onChangeText={(value) => setFieldValue('password', value)}
            errorMessage={errors.password}
            validationState={getValidationState('password')}
            type={isPasswordVisible ? 'text' : 'password'}
            maxLength={128}
            helperText={t('auth.register.onboarding.fields.passwordHint')}
            density="compact"
            suffix={
              <Button
                variant="text"
                size="small"
                type="button"
                onPress={() => setIsPasswordVisible((prev) => !prev)}
                accessibilityLabel={passwordToggleLabel}
                testID="register-password-toggle"
              >
                {passwordToggleLabel}
              </Button>
            }
            required
            testID="register-password"
          />
        </StyledFieldGrid>

        <StyledTerms>
          <Checkbox
            checked={form.termsAccepted}
            onChange={toggleTermsAcceptance}
            label={t('auth.layout.termsAcceptance.label')}
            accessibilityHint={t('auth.layout.termsAcceptance.hint')}
            testID="register-terms-checkbox"
          />
          <StyledTermsLink>
            <Button
              variant="text"
              size="small"
              type="button"
              onPress={goToTerms}
              accessibilityLabel={t('auth.layout.termsAcceptance.openTerms')}
              accessibilityHint={t('auth.layout.termsAcceptance.openTermsHint')}
              testID="register-terms-link"
            >
              {t('auth.layout.termsAcceptance.openTerms')}
            </Button>
          </StyledTermsLink>
          {errors.termsAccepted ? (
            <Text variant="caption" color="error" testID="register-terms-error">
              {errors.termsAccepted}
            </Text>
          ) : null}
        </StyledTerms>

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || !form.termsAccepted}
            accessibilityLabel={primaryLabel}
          >
            {primaryLabel}
          </Button>
        </StyledActions>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.register.onboarding.feedback.errorTitle')}
            description={submitError.message}
            testID="register-submit-error"
          />
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default RegisterScreenWeb;


