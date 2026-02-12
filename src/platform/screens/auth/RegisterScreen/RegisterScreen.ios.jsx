/**
 * RegisterScreen - iOS
 * Minimal signup step for onboarding.
 * File: RegisterScreen.ios.jsx
 */
import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateSizes,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useRegisterScreen from './useRegisterScreen';
import {
  StyledActions,
  StyledActionSlot,
  StyledContainer,
  StyledField,
  StyledFormGuidance,
  StyledForm,
  StyledStatus,
} from './RegisterScreen.ios.styles';

const RegisterScreenIOS = () => {
  const { t } = useI18n();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const {
    form,
    errors,
    isHydrating,
    isSubmitting,
    submitError,
    setFieldValue,
    handleSubmit,
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
    <StyledContainer>
      <StyledForm>
        <StyledFormGuidance />
        <StyledField>
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
        </StyledField>
        <StyledField>
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
        </StyledField>
        <StyledField>
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
        </StyledField>
        <StyledField>
          <TextField
            label={t('auth.register.onboarding.fields.password')}
            placeholder={t('auth.register.onboarding.placeholders.password')}
            value={form.password}
            onChangeText={(value) => setFieldValue('password', value)}
            errorMessage={errors.password}
            validationState={getValidationState('password')}
            type="password"
            maxLength={128}
            secureTextEntry={!isPasswordVisible}
            helperText={t('auth.register.onboarding.fields.passwordHint')}
            density="compact"
            suffix={
              <Button
                variant="text"
                size="small"
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
        </StyledField>

        <StyledActions>
          <StyledActionSlot $last>
            <Button
              variant="primary"
              size="small"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              accessibilityLabel={primaryLabel}
            >
              {primaryLabel}
            </Button>
          </StyledActionSlot>
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

export default RegisterScreenIOS;


