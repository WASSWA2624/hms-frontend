import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  GlobalSmartDateField,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Snackbar,
  Select,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import EntitlementBlockedState from '../components/EntitlementBlockedState';
import FieldHelpTrigger from '../components/FieldHelpTrigger';
import {
  StyledActions,
  StyledContainer,
  StyledFieldBlock,
  StyledFormGrid,
  StyledHeader,
} from './PatientQuickCreateScreen.styles';
import usePatientQuickCreateScreen from './usePatientQuickCreateScreen';

const resolveTextValue = (event) => (
  event?.target?.value
  ?? event?.nativeEvent?.text
  ?? ''
);

const PatientQuickCreateScreen = () => {
  const { t } = useI18n();
  const {
    values,
    errors,
    genderOptions,
    tenantOptions,
    facilityOptions,
    isLoading,
    isSubmitting = false,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    tenantErrorCode,
    tenantErrorMessage,
    facilityErrorCode,
    facilityErrorMessage,
    isTenantLoading,
    isFacilityLoading,
    requiresTenantSelection,
    canCreatePatientRecords,
    isSubmitDisabled = false,
    noticeMessage = '',
    noticeVariant = 'info',
    onChange,
    onCancel,
    onRetry,
    onRetryTenants,
    onRetryFacilities,
    onSubmit,
    onDismissNotice,
    onGoToSubscriptions,
  } = usePatientQuickCreateScreen();
  const isFormBusy = Boolean(isSubmitting || isLoading);
  const hasTenantSelection = !requiresTenantSelection || Boolean(values.tenant_id);

  const facilityHelperText = (
    errors.facility_id
    || (!hasTenantSelection
      ? t('patients.common.form.facilityRequiresTenantMessage')
      : t('patients.resources.patients.form.facilityHint'))
  );

  const renderTextField = (name, labelKey, placeholderKey, hintKey, maxLength) => (
    <StyledFieldBlock key={name}>
      <TextField
        label={t(labelKey)}
        value={values[name] || ''}
        placeholder={t(placeholderKey)}
        onChange={(event) => onChange(name, resolveTextValue(event))}
        helperText={errors[name] || t(hintKey)}
        errorMessage={errors[name]}
        maxLength={maxLength}
        density="compact"
        testID={`patient-quick-create-${name}`}
        disabled={isFormBusy}
      />
    </StyledFieldBlock>
  );

  return (
    <StyledContainer>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant={noticeVariant || 'info'}
          position="bottom"
          onDismiss={onDismissNotice}
          testID="patient-quick-create-notice"
        />
      ) : null}

      <StyledHeader>
        <Text variant="h2" accessibilityRole="header">
          {t('patients.resources.patients.form.createTitle')}
        </Text>
        <Text variant="body">{t('patients.common.form.description', { mode: t('patients.common.form.modeCreate'), resource: t('patients.resources.patients.label') })}</Text>
      </StyledHeader>

      {isLoading ? <LoadingSpinner accessibilityLabel={t('common.loading')} /> : null}

      {!isLoading && isEntitlementBlocked ? (
        <EntitlementBlockedState
          title={t('patients.entitlement.title')}
          description={t('patients.entitlement.description')}
          actionLabel={t('patients.entitlement.cta')}
          actionHint={t('patients.entitlement.ctaHint')}
          onAction={onGoToSubscriptions}
          testID="patient-quick-create-entitlement-blocked"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('patients.resources.patients.form.submitErrorTitle')}
          description={errorMessage}
          action={
            <Button
              variant="surface"
              size="medium"
              onPress={onRetry}
              accessibilityLabel={t('common.retry')}
              icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
            >
              {t('common.retry')}
            </Button>
          }
          testID="patient-quick-create-error"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && isOffline ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('shell.banners.offline.message')}
          testID="patient-quick-create-offline"
        />
      ) : null}

      {!isEntitlementBlocked ? (
        <Card variant="outlined">
          <FieldHelpTrigger
            label={t('patients.common.form.helpLabel')}
            tooltip={t('patients.common.form.helpTooltip')}
            helpTitle={t('patients.common.form.helpTitle')}
            helpBody={t('patients.common.form.helpBody', {
              mode: t('patients.common.form.modeCreate'),
            })}
            helpItems={[
              t('patients.common.form.helpItems.context'),
              t('patients.common.form.helpItems.required'),
              t('patients.common.form.helpItems.actions'),
              t('patients.common.form.helpItems.recovery'),
            ]}
            testID="patient-quick-create-form-help"
          />
          <StyledFormGrid>
            {requiresTenantSelection ? (
              <StyledFieldBlock>
              {isTenantLoading ? (
                <LoadingSpinner accessibilityLabel={t('common.loading')} />
              ) : tenantErrorCode ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('patients.common.form.tenantLoadErrorTitle')}
                  description={tenantErrorMessage}
                  action={(
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetryTenants}
                      accessibilityLabel={t('common.retry')}
                      icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
                      disabled={isFormBusy}
                    >
                      {t('common.retry')}
                    </Button>
                  )}
                  testID="patient-quick-create-tenant-error"
                />
              ) : tenantOptions.length === 0 ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('patients.common.form.tenantLoadErrorTitle')}
                  description={t('patients.common.form.noTenantsMessage')}
                  action={(
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetryTenants}
                      accessibilityLabel={t('common.retry')}
                      icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
                      disabled={isFormBusy}
                    >
                      {t('common.retry')}
                    </Button>
                  )}
                  testID="patient-quick-create-tenant-empty"
                />
              ) : (
                <Select
                  label={t('patients.common.form.tenantLabel')}
                  value={values.tenant_id || ''}
                  options={tenantOptions}
                  onValueChange={(value) => onChange('tenant_id', value)}
                  helperText={errors.tenant_id || t('patients.common.form.tenantHint')}
                  errorMessage={errors.tenant_id}
                  compact
                  testID="patient-quick-create-tenant"
                  disabled={isFormBusy}
                />
              )}
            </StyledFieldBlock>
          ) : null}

            {renderTextField(
              'first_name',
              'patients.resources.patients.form.firstNameLabel',
              'patients.resources.patients.form.firstNamePlaceholder',
              'patients.resources.patients.form.firstNameHint',
              120
            )}
            {renderTextField(
              'last_name',
              'patients.resources.patients.form.lastNameLabel',
              'patients.resources.patients.form.lastNamePlaceholder',
              'patients.resources.patients.form.lastNameHint',
              120
            )}
            <StyledFieldBlock>
              <GlobalSmartDateField
                label={t('patients.resources.patients.form.dateOfBirthLabel')}
                value={values.date_of_birth || ''}
                placeholder={t('patients.resources.patients.form.dateOfBirthPlaceholder')}
                onValueChange={(value) => onChange('date_of_birth', value)}
                helperText={errors.date_of_birth || t('patients.resources.patients.form.dateOfBirthHint')}
                errorMessage={errors.date_of_birth}
                density="compact"
                testID="patient-quick-create-date_of_birth"
                disabled={isFormBusy}
              />
            </StyledFieldBlock>

            <StyledFieldBlock>
              <Select
                label={t('patients.resources.patients.form.genderLabel')}
                value={values.gender || ''}
                options={genderOptions}
                onValueChange={(value) => onChange('gender', value)}
                helperText={t('patients.resources.patients.form.genderHint')}
                compact
                testID="patient-quick-create-gender"
                disabled={isFormBusy}
              />
            </StyledFieldBlock>

            <StyledFieldBlock>
              {!hasTenantSelection ? (
                <Select
                  label={t('patients.resources.patients.form.facilityLabel')}
                  value={values.facility_id || ''}
                  options={facilityOptions}
                  onValueChange={(value) => onChange('facility_id', value)}
                  helperText={facilityHelperText}
                  errorMessage={errors.facility_id}
                  compact
                  testID="patient-quick-create-facility"
                  disabled
                />
              ) : isFacilityLoading ? (
                <LoadingSpinner accessibilityLabel={t('common.loading')} />
              ) : facilityErrorCode ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('patients.common.form.facilityLoadErrorTitle')}
                  description={facilityErrorMessage}
                  action={(
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetryFacilities}
                      accessibilityLabel={t('common.retry')}
                      icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
                      disabled={isFormBusy}
                    >
                      {t('common.retry')}
                    </Button>
                  )}
                  testID="patient-quick-create-facility-error"
                />
              ) : (
                <Select
                  label={t('patients.resources.patients.form.facilityLabel')}
                  value={values.facility_id || ''}
                  options={facilityOptions}
                  onValueChange={(value) => onChange('facility_id', value)}
                  helperText={facilityHelperText}
                  errorMessage={errors.facility_id}
                  compact
                  testID="patient-quick-create-facility"
                  disabled={isFormBusy}
                />
              )}
            </StyledFieldBlock>

            <StyledFieldBlock>
              <Switch
                value={Boolean(values.is_active)}
                onValueChange={(value) => onChange('is_active', value)}
                label={t('patients.resources.patients.form.activeLabel')}
                testID="patient-quick-create-is-active"
                disabled={isFormBusy}
              />
            </StyledFieldBlock>
          </StyledFormGrid>
        </Card>
      ) : null}

      {!isEntitlementBlocked ? (
        <StyledActions>
          <Button
            variant="surface"
            size="medium"
            onPress={onCancel}
            accessibilityLabel={t('patients.resources.patients.form.cancel')}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
            disabled={isFormBusy}
            testID="patient-quick-create-cancel"
          >
            {t('patients.resources.patients.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="medium"
            onPress={onSubmit}
            disabled={!canCreatePatientRecords || isSubmitDisabled}
            loading={isSubmitting}
            accessibilityLabel={t('patients.resources.patients.form.submitCreate')}
            icon={<Icon glyph={'\u2713'} size="xs" decorative />}
            testID="patient-quick-create-submit"
          >
            {t('patients.resources.patients.form.submitCreate')}
          </Button>
        </StyledActions>
      ) : null}
    </StyledContainer>
  );
};

export default PatientQuickCreateScreen;

