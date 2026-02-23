import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import EntitlementBlockedState from '../components/EntitlementBlockedState';
import FieldHelpTrigger from '../components/FieldHelpTrigger';
import InlineFieldGuide from '../components/InlineFieldGuide';
import {
  StyledActions,
  StyledContainer,
  StyledFieldBlock,
  StyledFormGrid,
  StyledHeader,
} from './PatientQuickCreateScreen.styles';
import usePatientQuickCreateScreen from './usePatientQuickCreateScreen';

const PatientQuickCreateScreen = () => {
  const { t } = useI18n();
  const {
    values,
    errors,
    genderOptions,
    tenantOptions,
    facilityOptions,
    isLoading,
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
    onChange,
    onCancel,
    onRetry,
    onSubmit,
    onGoToSubscriptions,
  } = usePatientQuickCreateScreen();

  const renderTextField = (name, labelKey, placeholderKey, hintKey, maxLength) => (
    <StyledFieldBlock key={name}>
      <FieldHelpTrigger
        label={t(labelKey)}
        tooltip={t(hintKey)}
        helpTitle={t(labelKey)}
        helpBody={t(hintKey)}
        testID={`patient-quick-create-help-${name}`}
      />
      <InlineFieldGuide text={t(hintKey)} testID={`patient-quick-create-guide-${name}`} />
      <TextField
        value={values[name] || ''}
        placeholder={t(placeholderKey)}
        onChange={(event) => onChange(name, event?.target?.value || '')}
        helperText={errors[name] || t(hintKey)}
        errorMessage={errors[name]}
        maxLength={maxLength}
        density="compact"
        testID={`patient-quick-create-${name}`}
      />
    </StyledFieldBlock>
  );

  return (
    <StyledContainer>
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
          <StyledFormGrid>
            {requiresTenantSelection ? (
              <StyledFieldBlock>
                <FieldHelpTrigger
                  label={t('patients.common.form.tenantLabel')}
                  tooltip={t('patients.common.form.tenantHint')}
                  helpTitle={t('patients.common.form.tenantLabel')}
                  helpBody={t('patients.common.form.tenantHint')}
                  testID="patient-quick-create-help-tenant"
                />
                <InlineFieldGuide text={t('patients.common.form.tenantHint')} />
                {isTenantLoading ? (
                  <LoadingSpinner accessibilityLabel={t('common.loading')} />
                ) : tenantErrorCode ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('patients.common.form.tenantLoadErrorTitle')}
                    description={tenantErrorMessage}
                    testID="patient-quick-create-tenant-error"
                  />
                ) : (
                  <Select
                    value={values.tenant_id || ''}
                    options={tenantOptions}
                    onValueChange={(value) => onChange('tenant_id', value)}
                    helperText={errors.tenant_id || t('patients.common.form.tenantHint')}
                    errorMessage={errors.tenant_id}
                    compact
                    testID="patient-quick-create-tenant"
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
            {renderTextField(
              'date_of_birth',
              'patients.resources.patients.form.dateOfBirthLabel',
              'patients.resources.patients.form.dateOfBirthPlaceholder',
              'patients.resources.patients.form.dateOfBirthHint',
              10
            )}

            <StyledFieldBlock>
              <FieldHelpTrigger
                label={t('patients.resources.patients.form.genderLabel')}
                tooltip={t('patients.resources.patients.form.genderHint')}
                helpTitle={t('patients.resources.patients.form.genderLabel')}
                helpBody={t('patients.resources.patients.form.genderHint')}
                testID="patient-quick-create-help-gender"
              />
              <InlineFieldGuide text={t('patients.resources.patients.form.genderHint')} />
              <Select
                value={values.gender || ''}
                options={genderOptions}
                onValueChange={(value) => onChange('gender', value)}
                compact
                testID="patient-quick-create-gender"
              />
            </StyledFieldBlock>

            <StyledFieldBlock>
              <FieldHelpTrigger
                label={t('patients.resources.patients.form.facilityLabel')}
                tooltip={t('patients.resources.patients.form.facilityHint')}
                helpTitle={t('patients.resources.patients.form.facilityLabel')}
                helpBody={t('patients.resources.patients.form.facilityHint')}
                testID="patient-quick-create-help-facility"
              />
              <InlineFieldGuide text={t('patients.resources.patients.form.facilityHint')} />
              {isFacilityLoading ? (
                <LoadingSpinner accessibilityLabel={t('common.loading')} />
              ) : facilityErrorCode ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('patients.common.form.facilityLoadErrorTitle')}
                  description={facilityErrorMessage}
                  testID="patient-quick-create-facility-error"
                />
              ) : (
                <Select
                  value={values.facility_id || ''}
                  options={facilityOptions}
                  onValueChange={(value) => onChange('facility_id', value)}
                  compact
                  testID="patient-quick-create-facility"
                />
              )}
            </StyledFieldBlock>

            <StyledFieldBlock>
              <FieldHelpTrigger
                label={t('patients.resources.patients.form.activeLabel')}
                tooltip={t('patients.resources.patients.form.activeHint')}
                helpTitle={t('patients.resources.patients.form.activeLabel')}
                helpBody={t('patients.resources.patients.form.activeHint')}
                testID="patient-quick-create-help-is-active"
              />
              <InlineFieldGuide text={t('patients.resources.patients.form.activeHint')} />
              <Switch
                value={Boolean(values.is_active)}
                onValueChange={(value) => onChange('is_active', value)}
                label={t('patients.resources.patients.form.activeLabel')}
                testID="patient-quick-create-is-active"
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
          >
            {t('patients.resources.patients.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="medium"
            onPress={onSubmit}
            disabled={!canCreatePatientRecords || isLoading}
            loading={isLoading}
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

