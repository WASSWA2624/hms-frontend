/**
 * TenantSelectionScreen - Web
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
import useTenantSelectionScreen from './useTenantSelectionScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
} from './TenantSelectionScreen.web.styles';

const TenantSelectionScreenWeb = () => {
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
    <StyledContainer role="region" aria-label={t('auth.tenantSelection.title')}>
      <StyledForm
        onSubmit={(event) => {
          event.preventDefault();
          handlePrimaryAction();
        }}
      >
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
            <Select
              label={t('auth.tenantSelection.fields.tenant.label')}
              options={tenantOptions}
              value={form.tenant_id}
              onValueChange={(value) => setFieldValue('tenant_id', value)}
              placeholder={t('auth.tenantSelection.fields.tenant.placeholder')}
              errorMessage={errors.tenant_id}
              validationState={getValidationState('tenant_id')}
              helperText={t('auth.tenantSelection.fields.tenant.hint')}
              compact
              required
              testID="tenant-selection-tenant"
            />
          </StyledField>
        ) : null}

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            aria-disabled={isSubmitDisabled ? 'true' : undefined}
            accessibilityLabel={t('auth.tenantSelection.actions.continueHint')}
            accessibilityHint={isSubmitDisabled && submitBlockedReason ? submitBlockedReason : undefined}
            testID="tenant-selection-submit"
          >
            {primaryLabel}
          </Button>

          <Button
            variant="text"
            size="small"
            type="button"
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

export default TenantSelectionScreenWeb;

