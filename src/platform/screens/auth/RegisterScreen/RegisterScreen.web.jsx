/**
 * RegisterScreen - Web
 * Minimal signup step for onboarding.
 * File: RegisterScreen.web.jsx
 */
import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateSizes,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useRegisterScreen from './useRegisterScreen';
import {
  StyledActions,
  StyledContainer,
  StyledFieldGrid,
  StyledFormGuidance,
  StyledForm,
  StyledStatus,
} from './RegisterScreen.web.styles';

const RegisterScreenWeb = () => {
  const { t } = useI18n();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const {
    form,
    errors,
    facilityOptions,
    isHydrating,
    isSubmitting,
    isSuccess,
    submitError,
    setFieldValue,
    handleSubmit,
    handleContinue,
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

  const primaryLabel = isSuccess ? t('auth.register.onboarding.actions.continue') : t('auth.register.onboarding.actions.createWorkspace');
  const passwordToggleLabel = isPasswordVisible
    ? t('auth.register.onboarding.actions.hidePassword')
    : t('auth.register.onboarding.actions.showPassword');
  const getValidationState = (field) => (errors[field] ? 'error' : 'default');

  return (
    <StyledContainer role="region" aria-label={t('auth.register.onboarding.layoutLabel')}>
      <StyledForm
        onSubmit={(event) => {
          event.preventDefault();
          if (isSuccess) {
            handleContinue();
            return;
          }
          handleSubmit();
        }}
      >
        <StyledFormGuidance>
          <Text variant="caption">{t('auth.layout.subtitle')}</Text>
        </StyledFormGuidance>
        <StyledFieldGrid>
          <Select
            label={t('auth.register.onboarding.fields.facilityType')}
            options={facilityOptions}
            value={form.facilityType}
            onValueChange={(value) => setFieldValue('facilityType', value)}
            placeholder={t('auth.register.onboarding.placeholders.facilityType')}
            errorMessage={errors.facilityType}
            validationState={getValidationState('facilityType')}
            compact
            required
            testID="register-facility-type"
          />
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
            label={t('auth.register.onboarding.fields.phone')}
            placeholder={t('auth.register.onboarding.placeholders.phone')}
            value={form.phone}
            onChangeText={(value) => setFieldValue('phone', value)}
            errorMessage={errors.phone}
            validationState={getValidationState('phone')}
            type="tel"
            maxLength={15}
            helperText={t('auth.register.onboarding.fields.phoneHint')}
            density="compact"
            testID="register-phone"
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

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
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
        {isSuccess ? (
          <Text variant="caption" testID="register-submit-success">
            {t('auth.register.onboarding.feedback.success')}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default RegisterScreenWeb;


