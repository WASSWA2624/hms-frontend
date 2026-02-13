/**
 * FacilitySelectionScreen - Web
 */
import React from 'react';
import {
  Button,
  ErrorState,
  ErrorStateSizes,
  Select,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import useFacilitySelectionScreen from './useFacilitySelectionScreen';
import {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
  StyledSummary,
} from './FacilitySelectionScreen.web.styles';

const FacilitySelectionScreenWeb = () => {
  const { t } = useI18n();
  const {
    form,
    errors,
    hasContext,
    facilityOptions,
    isSubmitting,
    submitError,
    submitBlockedReason,
    isSubmitDisabled,
    identifier,
    tenantId,
    setFieldValue,
    handleSubmit,
    goToLogin,
    goToTenantSelection,
  } = useFacilitySelectionScreen();

  if (!hasContext) {
    return (
      <StyledContainer role="region" aria-label={t('auth.facilitySelection.title')}>
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('auth.facilitySelection.error.missingContextTitle')}
          description={t('auth.facilitySelection.error.missingContextDescription')}
          action={(
            <Button
              variant="primary"
              size="small"
              type="button"
              onPress={goToLogin}
              accessibilityLabel={t('auth.facilitySelection.actions.loginHint')}
              testID="facility-selection-missing-context-login"
            >
              {t('auth.facilitySelection.actions.login')}
            </Button>
          )}
          testID="facility-selection-missing-context"
        />
      </StyledContainer>
    );
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');

  return (
    <StyledContainer role="region" aria-label={t('auth.facilitySelection.title')}>
      <StyledSummary>
        <Text variant="label">{t('auth.facilitySelection.summary.identifier', { identifier })}</Text>
        <Text variant="caption">{t('auth.facilitySelection.summary.tenant', { tenantId })}</Text>
      </StyledSummary>

      <StyledForm
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <StyledField>
          <Select
            label={t('auth.facilitySelection.fields.facility.label')}
            options={facilityOptions}
            value={form.facility_id}
            onValueChange={(value) => setFieldValue('facility_id', value)}
            placeholder={t('auth.facilitySelection.fields.facility.placeholder')}
            errorMessage={errors.facility_id}
            validationState={getValidationState('facility_id')}
            helperText={t('auth.facilitySelection.fields.facility.hint')}
            compact
            required
            testID="facility-selection-facility"
          />
        </StyledField>

        <StyledActions>
          <Button
            variant="primary"
            size="small"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            aria-disabled={isSubmitDisabled ? 'true' : undefined}
            accessibilityLabel={t('auth.facilitySelection.actions.continueHint')}
            accessibilityHint={isSubmitDisabled && submitBlockedReason ? submitBlockedReason : undefined}
            testID="facility-selection-submit"
          >
            {t('common.continue')}
          </Button>

          <Button
            variant="text"
            size="small"
            type="button"
            onPress={goToTenantSelection}
            accessibilityLabel={t('auth.facilitySelection.actions.tenantHint')}
            testID="facility-selection-tenant"
          >
            {t('auth.facilitySelection.actions.tenant')}
          </Button>

          <Button
            variant="text"
            size="small"
            type="button"
            onPress={goToLogin}
            accessibilityLabel={t('auth.facilitySelection.actions.loginHint')}
            testID="facility-selection-login"
          >
            {t('auth.facilitySelection.actions.login')}
          </Button>
        </StyledActions>
      </StyledForm>

      <StyledStatus>
        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('auth.facilitySelection.error.title')}
            description={submitError.message}
            testID="facility-selection-submit-error"
          />
        ) : null}
        {!submitError && submitBlockedReason ? (
          <Text variant="caption" testID="facility-selection-submit-reason">
            {submitBlockedReason}
          </Text>
        ) : null}
      </StyledStatus>
    </StyledContainer>
  );
};

export default FacilitySelectionScreenWeb;

