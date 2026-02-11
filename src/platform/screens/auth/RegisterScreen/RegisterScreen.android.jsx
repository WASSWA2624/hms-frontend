/**
 * RegisterScreen - Android
 * Minimal signup step for onboarding.
 * File: RegisterScreen.android.jsx
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
  StyledActionSlot,
  StyledContainer,
  StyledForm,
  StyledStatus,
  StyledTitleBlock,
  StyledTopActions,
} from './RegisterScreen.android.styles';

const RegisterScreenAndroid = () => {
  const { t } = useI18n();
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
    handleBack,
    handleCancel,
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

  return (
    <StyledContainer>
      <StyledTopActions>
        <Button variant="text" size="small" onPress={handleBack} accessibilityLabel={t('auth.register.onboarding.actions.back')}>
          {t('auth.register.onboarding.actions.back')}
        </Button>
      </StyledTopActions>

      <StyledTitleBlock>
        <Text variant="h2">{t('auth.register.onboarding.title')}</Text>
        <Text variant="caption">{t('auth.register.onboarding.subtitle')}</Text>
      </StyledTitleBlock>

      <StyledForm>
        <TextField
          label={t('auth.register.onboarding.fields.facilityName')}
          placeholder={t('auth.register.onboarding.placeholders.facilityName')}
          value={form.facilityName}
          onChangeText={(value) => setFieldValue('facilityName', value)}
          errorMessage={errors.facilityName}
          required
          testID="register-facility-name"
        />
        <TextField
          label={t('auth.register.onboarding.fields.adminName')}
          placeholder={t('auth.register.onboarding.placeholders.adminName')}
          value={form.adminName}
          onChangeText={(value) => setFieldValue('adminName', value)}
          errorMessage={errors.adminName}
          required
          testID="register-admin-name"
        />
        <Select
          label={t('auth.register.onboarding.fields.facilityType')}
          options={facilityOptions}
          value={form.facilityType}
          onValueChange={(value) => setFieldValue('facilityType', value)}
          placeholder={t('auth.register.onboarding.placeholders.facilityType')}
          errorMessage={errors.facilityType}
          required
          testID="register-facility-type"
        />
        <TextField
          label={t('auth.register.onboarding.fields.email')}
          placeholder={t('auth.register.onboarding.placeholders.email')}
          value={form.email}
          onChangeText={(value) => setFieldValue('email', value)}
          errorMessage={errors.email}
          type="email"
          required
          testID="register-email"
        />
        <TextField
          label={t('auth.register.onboarding.fields.phone')}
          placeholder={t('auth.register.onboarding.placeholders.phone')}
          value={form.phone}
          onChangeText={(value) => setFieldValue('phone', value)}
          errorMessage={errors.phone}
          type="tel"
          helperText={t('auth.register.onboarding.fields.phoneHint')}
          testID="register-phone"
        />
        <TextField
          label={t('auth.register.onboarding.fields.password')}
          placeholder={t('auth.register.onboarding.placeholders.password')}
          value={form.password}
          onChangeText={(value) => setFieldValue('password', value)}
          errorMessage={errors.password}
          type="password"
          required
          testID="register-password"
        />

        <StyledActions>
          <StyledActionSlot>
            <Button
              variant="surface"
              size="small"
              onPress={handleCancel}
              disabled={isSubmitting}
              accessibilityLabel={t('auth.register.onboarding.actions.cancel')}
            >
              {t('auth.register.onboarding.actions.cancel')}
            </Button>
          </StyledActionSlot>
          <StyledActionSlot $last>
            <Button
              variant="primary"
              size="small"
              onPress={isSuccess ? handleContinue : handleSubmit}
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
        {isSuccess ? (
          <Text variant="caption" testID="register-submit-success">
            {t('auth.register.onboarding.feedback.success')}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default RegisterScreenAndroid;


