/**
 * TenantSelectionScreen - iOS
 */
import React from 'react';
import {
  Button,
  Checkbox,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Stack,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useTenantSelectionScreen from './useTenantSelectionScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
} from './TenantSelectionScreen.ios.styles';

const TenantSelectionScreenIOS = () => {
  const { t } = useI18n();
  const {
    form,
    tenantOptions,
    errors,
    isTenantStep,
    isHydrating,
    isSubmitting,
    submitError,
    submitBlockedReason,
    isSubmitDisabled,
    setFieldValue,
    handlePrimaryAction,
    goToLogin,
  } = useTenantSelectionScreen();

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-selection-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');
  const primaryLabel = isTenantStep
    ? t('common.continue')
    : t('auth.tenantSelection.actions.findTenants');

  return (
    <StyledContainer>
      <StyledForm>
        <StyledField>
          <TextField
            label={t('auth.tenantSelection.fields.identifier.label')}
            placeholder={t('auth.tenantSelection.fields.identifier.placeholder')}
            value={form.identifier}
            onChangeText={(value) => setFieldValue('identifier', value)}
            errorMessage={errors.identifier}
            validationState={getValidationState('identifier')}
            helperText={t('auth.tenantSelection.fields.identifier.hint')}
            maxLength={320}
            density="compact"
            required
            testID="tenant-selection-identifier"
          />
        </StyledField>

        {isTenantStep ? (
          <StyledField>
            <Stack spacing="xs">
              <Text variant="label">{t('auth.tenantSelection.fields.tenant.label')}</Text>
              <Text variant="caption">{t('auth.tenantSelection.fields.tenant.hint')}</Text>
              <Stack spacing="xs">
                {tenantOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    checked={form.tenant_id === option.value}
                    onChange={(checked) => setFieldValue('tenant_id', checked ? option.value : '')}
                    label={option.label}
                    accessibilityHint={t('auth.tenantSelection.fields.tenant.hint')}
                    testID={`tenant-selection-option-${option.value}`}
                  />
                ))}
              </Stack>
              {errors.tenant_id ? (
                <Text variant="caption" color="error" testID="tenant-selection-tenant-error">
                  {errors.tenant_id}
                </Text>
              ) : null}
            </Stack>
          </StyledField>
        ) : null}

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            onPress={handlePrimaryAction}
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            accessibilityLabel={t('auth.tenantSelection.actions.continueHint')}
            accessibilityHint={isSubmitDisabled && submitBlockedReason ? submitBlockedReason : undefined}
            testID="tenant-selection-submit"
          >
            {primaryLabel}
          </Button>

          <Button
            variant="text"
            size="small"
            onPress={goToLogin}
            accessibilityLabel={t('auth.tenantSelection.actions.loginHint')}
            testID="tenant-selection-login"
          >
            {t('auth.tenantSelection.actions.login')}
          </Button>
        </StyledActions>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.tenantSelection.error.title')}
            description={submitError.message}
            testID="tenant-selection-submit-error"
          />
        ) : null}
        {!submitError && submitBlockedReason ? (
          <Text variant="caption" testID="tenant-selection-submit-reason">
            {submitBlockedReason}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default TenantSelectionScreenIOS;
