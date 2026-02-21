import React, { useState } from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  Modal,
  OfflineState,
  OfflineStateSizes,
  Select,
  Switch,
  Text,
  TextField,
  Tooltip,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelperStack,
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledInlineStates,
} from './PatientResourceFormScreen.web.styles';
import usePatientResourceFormScreen from './usePatientResourceFormScreen';

const PatientResourceFormScreenWeb = ({ resourceId }) => {
  const { t } = useI18n();
  const {
    config,
    formDescription,
    helpContent,
    visibleFields,
    showTenantField,
    isEdit,
    values,
    setFieldValue,
    errors,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantListErrorMessage,
    hasTenants,
    facilityListLoading,
    facilityListError,
    facilityListErrorMessage,
    hasFacilities,
    facilityRequiresTenantSelection,
    patientOptions,
    patientListLoading,
    patientListError,
    patientListErrorMessage,
    hasPatients,
    isCreateBlocked,
    isLoading,
    hasError,
    submitErrorMessage,
    isOffline,
    record,
    tenantHint,
    onSubmit,
    onCancel,
    onRetryTenants,
    onRetryFacilities,
    onRetryPatients,
    onGoToPatients,
    isSubmitDisabled,
  } = usePatientResourceFormScreen(resourceId);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHelpTooltipVisible, setIsHelpTooltipVisible] = useState(false);

  if (!config) return null;

  const showInitialLoading = isEdit && !record && isLoading;
  const showInitialError = isEdit && hasError && !record && !isLoading;

  return (
    <StyledContainer role="main" aria-label={isEdit ? t(`${config.i18nKey}.form.editTitle`) : t(`${config.i18nKey}.form.createTitle`)}>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderTop>
            <StyledHeaderCopy>
              <Text variant="h2" accessibilityRole="header" testID="patient-resource-form-title">
                {isEdit ? t(`${config.i18nKey}.form.editTitle`) : t(`${config.i18nKey}.form.createTitle`)}
              </Text>
              <Text variant="body">{formDescription}</Text>
            </StyledHeaderCopy>
            <StyledHelpAnchor>
              <StyledHelpButton
                type="button"
                aria-label={helpContent?.label}
                testID="patient-resource-form-help-trigger"
                onMouseEnter={() => setIsHelpTooltipVisible(true)}
                onMouseLeave={() => setIsHelpTooltipVisible(false)}
                onFocus={() => setIsHelpTooltipVisible(true)}
                onBlur={() => setIsHelpTooltipVisible(false)}
                onClick={() => setIsHelpOpen(true)}
              >
                <Icon glyph="?" size="xs" decorative />
              </StyledHelpButton>
              <Tooltip
                visible={isHelpTooltipVisible && !isHelpOpen}
                position="bottom"
                text={helpContent?.tooltip || ''}
              />
            </StyledHelpAnchor>
          </StyledHeaderTop>
        </StyledHeader>

        <Modal
          visible={isHelpOpen}
          onDismiss={() => setIsHelpOpen(false)}
          size="small"
          accessibilityLabel={helpContent?.title}
          testID="patient-resource-form-help-modal"
        >
          <StyledHelpModalTitle>{helpContent?.title}</StyledHelpModalTitle>
          <StyledHelpModalBody>{helpContent?.body}</StyledHelpModalBody>
          <StyledHelpChecklist>
            {(helpContent?.items || []).map((itemText) => (
              <StyledHelpItem key={itemText}>{itemText}</StyledHelpItem>
            ))}
          </StyledHelpChecklist>
        </Modal>

        {showInitialLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-resource-form-loading" />
        ) : null}

        {showInitialError ? (
          <ErrorState
            title={t(`${config.i18nKey}.form.loadError`)}
            action={
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t(`${config.i18nKey}.form.cancelHint`)}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            }
            testID="patient-resource-form-load-error"
          />
        ) : null}

        {!showInitialLoading && !showInitialError ? (
          <>
            <StyledInlineStates>
              {isOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  testID="patient-resource-form-offline"
                />
              ) : null}

              {hasError && (isEdit ? Boolean(record) : true) ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t(`${config.i18nKey}.form.submitErrorTitle`)}
                  description={submitErrorMessage}
                  testID="patient-resource-form-submit-error"
                />
              ) : null}
            </StyledInlineStates>

            <Card variant="outlined" accessibilityLabel={t(`${config.i18nKey}.form.cardLabel`)} testID="patient-resource-form-card">
              <StyledFormGrid>
                {showTenantField ? (
                  <StyledFullRow>
                    <StyledFieldGroup>
                      {tenantListLoading ? (
                        <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-resource-form-tenant-loading" />
                      ) : tenantListError ? (
                        <ErrorState
                          size={ErrorStateSizes.SMALL}
                          title={t('patients.common.form.tenantLoadErrorTitle')}
                          description={tenantListErrorMessage}
                          action={
                            <Button
                              variant="surface"
                              size="small"
                              onPress={onRetryTenants}
                              accessibilityLabel={t('common.retry')}
                              accessibilityHint={t('common.retryHint')}
                              icon={<Icon glyph="?" size="xs" decorative />}
                            >
                              {t('common.retry')}
                            </Button>
                          }
                          testID="patient-resource-form-tenant-error"
                        />
                      ) : !hasTenants ? (
                        <StyledHelperStack>
                          <Text variant="body">{t('patients.common.form.noTenantsMessage')}</Text>
                        </StyledHelperStack>
                      ) : (
                        <Select
                          label={t('patients.common.form.tenantLabel')}
                          placeholder={t('patients.common.form.tenantPlaceholder')}
                          options={tenantOptions}
                          value={values.tenant_id || ''}
                          onValueChange={(nextValue) => setFieldValue('tenant_id', nextValue)}
                          accessibilityLabel={t('patients.common.form.tenantLabel')}
                          accessibilityHint={tenantHint}
                          helperText={errors.tenant_id || tenantHint}
                          errorMessage={errors.tenant_id}
                          required
                          compact
                          disabled={isLoading}
                          testID="patient-resource-form-tenant"
                        />
                      )}
                    </StyledFieldGroup>
                  </StyledFullRow>
                ) : null}

                {config.requiresPatientSelection ? (
                  <StyledFullRow>
                    <StyledFieldGroup>
                      {patientListLoading ? (
                        <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-resource-form-patient-loading" />
                      ) : patientListError ? (
                        <ErrorState
                          size={ErrorStateSizes.SMALL}
                          title={t('patients.common.form.patientLoadErrorTitle')}
                          description={patientListErrorMessage}
                          action={
                            <Button
                              variant="surface"
                              size="small"
                              onPress={onRetryPatients}
                              accessibilityLabel={t('common.retry')}
                              accessibilityHint={t('common.retryHint')}
                              icon={<Icon glyph="?" size="xs" decorative />}
                            >
                              {t('common.retry')}
                            </Button>
                          }
                          testID="patient-resource-form-patient-error"
                        />
                      ) : !hasPatients ? (
                        <StyledHelperStack>
                          <Text variant="body">{t('patients.common.form.noPatientsMessage')}</Text>
                          <Button
                            variant="surface"
                            size="small"
                            onPress={onGoToPatients}
                            accessibilityLabel={t('patients.common.form.goToPatients')}
                            accessibilityHint={t('patients.common.form.goToPatientsHint')}
                            icon={<Icon glyph="?" size="xs" decorative />}
                            testID="patient-resource-form-go-to-patients"
                          >
                            {t('patients.common.form.goToPatients')}
                          </Button>
                        </StyledHelperStack>
                      ) : (
                        <Select
                          label={t('patients.common.form.patientLabel')}
                          placeholder={t('patients.common.form.patientPlaceholder')}
                          options={patientOptions}
                          value={values.patient_id || ''}
                          onValueChange={(nextValue) => setFieldValue('patient_id', nextValue)}
                          accessibilityLabel={t('patients.common.form.patientLabel')}
                          accessibilityHint={t('patients.common.form.patientHint')}
                          helperText={errors.patient_id || t('patients.common.form.patientHint')}
                          errorMessage={errors.patient_id}
                          required
                          compact
                          disabled={isLoading}
                          testID="patient-resource-form-patient"
                        />
                      )}
                    </StyledFieldGroup>
                  </StyledFullRow>
                ) : null}

                {visibleFields.map((field) => {
                  const fieldValue = values[field.name];
                  const fieldError = errors[field.name];

                  if (field.type === 'switch') {
                    return (
                      <StyledFieldGroup key={field.name}>
                        <Switch
                          value={Boolean(fieldValue)}
                          onValueChange={(nextValue) => setFieldValue(field.name, nextValue)}
                          label={t(field.labelKey)}
                          accessibilityLabel={t(field.labelKey)}
                          accessibilityHint={t(field.hintKey)}
                          disabled={isLoading}
                          testID={`patient-resource-form-${field.name}`}
                        />
                      </StyledFieldGroup>
                    );
                  }

                  if (field.type === 'select') {
                    if (field.name === 'facility_id') {
                      if (facilityRequiresTenantSelection) {
                        return (
                          <StyledFieldGroup key={field.name}>
                            <StyledHelperStack>
                              <Text variant="body">{t('patients.common.form.facilityRequiresTenantMessage')}</Text>
                            </StyledHelperStack>
                          </StyledFieldGroup>
                        );
                      }

                      if (facilityListLoading) {
                        return (
                          <StyledFieldGroup key={field.name}>
                            <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-resource-form-facility-loading" />
                          </StyledFieldGroup>
                        );
                      }

                      if (facilityListError) {
                        return (
                          <StyledFieldGroup key={field.name}>
                            <ErrorState
                              size={ErrorStateSizes.SMALL}
                              title={t('patients.common.form.facilityLoadErrorTitle')}
                              description={facilityListErrorMessage}
                              action={
                                <Button
                                  variant="surface"
                                  size="small"
                                  onPress={onRetryFacilities}
                                  accessibilityLabel={t('common.retry')}
                                  accessibilityHint={t('common.retryHint')}
                                  icon={<Icon glyph="?" size="xs" decorative />}
                                >
                                  {t('common.retry')}
                                </Button>
                              }
                              testID="patient-resource-form-facility-error"
                            />
                          </StyledFieldGroup>
                        );
                      }

                      if (!hasFacilities) {
                        return (
                          <StyledFieldGroup key={field.name}>
                            <StyledHelperStack>
                              <Text variant="body">{t('patients.common.form.noFacilitiesMessage')}</Text>
                            </StyledHelperStack>
                          </StyledFieldGroup>
                        );
                      }
                    }

                    const selectOptions = (field.options || []).map((option) => ({
                      value: option.value,
                      label: t(option.labelKey),
                    }));

                    const resolvedOptions = field.name === 'facility_id'
                      ? (field.options || [])
                      : selectOptions;

                    return (
                      <StyledFieldGroup key={field.name}>
                        <Select
                          label={t(field.labelKey)}
                          placeholder={t(field.placeholderKey)}
                          options={resolvedOptions}
                          value={fieldValue || ''}
                          onValueChange={(nextValue) => setFieldValue(field.name, nextValue)}
                          accessibilityLabel={t(field.labelKey)}
                          accessibilityHint={t(field.hintKey)}
                          helperText={fieldError || t(field.hintKey)}
                          errorMessage={fieldError}
                          required={Boolean(field.required)}
                          compact
                          disabled={isLoading}
                          testID={`patient-resource-form-${field.name}`}
                        />
                      </StyledFieldGroup>
                    );
                  }

                  return (
                    <StyledFieldGroup key={field.name}>
                      <TextField
                        label={t(field.labelKey)}
                        placeholder={t(field.placeholderKey)}
                        value={fieldValue || ''}
                        onChange={(event) => setFieldValue(field.name, event.target.value)}
                        accessibilityLabel={t(field.labelKey)}
                        accessibilityHint={t(field.hintKey)}
                        helperText={fieldError || t(field.hintKey)}
                        errorMessage={fieldError}
                        required={Boolean(field.required)}
                        maxLength={field.maxLength}
                        density="compact"
                        disabled={isLoading}
                        testID={`patient-resource-form-${field.name}`}
                      />
                    </StyledFieldGroup>
                  );
                })}
              </StyledFormGrid>
            </Card>

            {isCreateBlocked ? (
              <Text variant="body">{t('patients.common.form.createBlockedMessage')}</Text>
            ) : null}

            <StyledActions>
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t(`${config.i18nKey}.form.cancel`)}
                accessibilityHint={t(`${config.i18nKey}.form.cancelHint`)}
                icon={<Icon glyph="?" size="xs" decorative />}
                testID="patient-resource-form-cancel"
                disabled={isLoading}
              >
                {t(`${config.i18nKey}.form.cancel`)}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onSubmit}
                loading={isLoading}
                disabled={isSubmitDisabled}
                accessibilityLabel={isEdit ? t(`${config.i18nKey}.form.submitEdit`) : t(`${config.i18nKey}.form.submitCreate`)}
                accessibilityHint={isEdit ? t(`${config.i18nKey}.form.submitEdit`) : t(`${config.i18nKey}.form.submitCreate`)}
                icon={<Icon glyph="?" size="xs" decorative />}
                testID="patient-resource-form-submit"
              >
                {isEdit ? t(`${config.i18nKey}.form.submitEdit`) : t(`${config.i18nKey}.form.submitCreate`)}
              </Button>
            </StyledActions>
          </>
        ) : null}
      </StyledContent>
    </StyledContainer>
  );
};

export default PatientResourceFormScreenWeb;
