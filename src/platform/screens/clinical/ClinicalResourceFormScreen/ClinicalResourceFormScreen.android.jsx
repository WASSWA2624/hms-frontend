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
  TextArea,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledInlineStates,
} from './ClinicalResourceFormScreen.android.styles';
import useClinicalResourceFormScreen from './useClinicalResourceFormScreen';

const ClinicalResourceFormScreenAndroid = ({ resourceId }) => {
  const { t } = useI18n();
  const {
    config,
    isEdit,
    values,
    setFieldValue,
    errors,
    resolvedFields,
    isLoading,
    hasError,
    submitErrorMessage,
    isOffline,
    record,
    tenantLocked,
    tenantHint,
    onSubmit,
    onCancel,
    isSubmitDisabled,
  } = useClinicalResourceFormScreen(resourceId);

  if (!config) return null;

  if (isEdit && !record && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="clinical-resource-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !record) {
    return (
      <StyledContainer>
        <StyledContent>
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
            testID="clinical-resource-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="clinical-resource-form-title">
          {isEdit ? t(`${config.i18nKey}.form.editTitle`) : t(`${config.i18nKey}.form.createTitle`)}
        </Text>

        <StyledInlineStates>
          {isOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="clinical-resource-form-offline"
            />
          ) : null}

          {hasError && (isEdit ? Boolean(record) : true) ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t(`${config.i18nKey}.form.submitErrorTitle`)}
              description={submitErrorMessage}
              testID="clinical-resource-form-submit-error"
            />
          ) : null}
        </StyledInlineStates>

        <Card
          variant="outlined"
          accessibilityLabel={t(`${config.i18nKey}.form.cardLabel`)}
          testID="clinical-resource-form-card"
        >
          <StyledFormGrid>
            {config.requiresTenant ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('clinical.common.form.tenantLabel')}
                    value={values.tenant_id || ''}
                    onChangeText={(nextValue) => setFieldValue('tenant_id', nextValue)}
                    accessibilityLabel={t('clinical.common.form.tenantLabel')}
                    accessibilityHint={tenantHint}
                    helperText={errors.tenant_id || tenantHint}
                    errorMessage={errors.tenant_id}
                    required
                    disabled={tenantLocked || isLoading}
                    testID="clinical-resource-form-tenant"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            ) : null}

            {resolvedFields.map((field) => {
              if (field.hidden) return null;
              const fieldValue = values[field.name];
              const fieldError = errors[field.name];
              const isFieldDisabled = Boolean(field.disabled || isLoading);

              if (field.type === 'switch') {
                return (
                  <StyledFieldGroup key={field.name}>
                    <Switch
                      value={Boolean(fieldValue)}
                      onValueChange={(nextValue) => setFieldValue(field.name, nextValue)}
                      label={t(field.labelKey)}
                      accessibilityLabel={t(field.labelKey)}
                      accessibilityHint={field.hintKey ? t(field.hintKey) : undefined}
                      disabled={isFieldDisabled}
                      testID={`clinical-resource-form-${field.name}`}
                    />
                  </StyledFieldGroup>
                );
              }

              if (field.type === 'select') {
                const selectOptions = (field.options || []).map((option) => ({
                  value: option.value,
                  label: option.labelKey ? t(option.labelKey) : option.label || option.value,
                }));

                return (
                  <StyledFieldGroup key={field.name}>
                    <Select
                      label={t(field.labelKey)}
                      placeholder={t(field.placeholderKey)}
                      options={selectOptions}
                      value={fieldValue || ''}
                      onValueChange={(nextValue) => setFieldValue(field.name, nextValue)}
                      accessibilityLabel={t(field.labelKey)}
                      accessibilityHint={field.hintKey ? t(field.hintKey) : undefined}
                      helperText={fieldError || (field.hintKey ? t(field.hintKey) : '')}
                      errorMessage={fieldError}
                      required={Boolean(field.required)}
                      compact
                      disabled={isFieldDisabled}
                      testID={`clinical-resource-form-${field.name}`}
                    />
                  </StyledFieldGroup>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <StyledFieldGroup key={field.name}>
                    <TextArea
                      label={t(field.labelKey)}
                      placeholder={t(field.placeholderKey)}
                      value={fieldValue || ''}
                      onChangeText={(nextValue) => setFieldValue(field.name, nextValue)}
                      accessibilityLabel={t(field.labelKey)}
                      accessibilityHint={field.hintKey ? t(field.hintKey) : undefined}
                      helperText={fieldError || (field.hintKey ? t(field.hintKey) : '')}
                      errorMessage={fieldError}
                      required={Boolean(field.required)}
                      maxLength={field.maxLength}
                      disabled={isFieldDisabled}
                      testID={`clinical-resource-form-${field.name}`}
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
                    onChangeText={(nextValue) => setFieldValue(field.name, nextValue)}
                    accessibilityLabel={t(field.labelKey)}
                    accessibilityHint={field.hintKey ? t(field.hintKey) : undefined}
                    helperText={fieldError || (field.hintKey ? t(field.hintKey) : '')}
                    errorMessage={fieldError}
                    required={Boolean(field.required)}
                    maxLength={field.maxLength}
                    density="compact"
                    disabled={isFieldDisabled}
                    testID={`clinical-resource-form-${field.name}`}
                  />
                </StyledFieldGroup>
              );
            })}
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t(`${config.i18nKey}.form.cancel`)}
            accessibilityHint={t(`${config.i18nKey}.form.cancelHint`)}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="clinical-resource-form-cancel"
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
            testID="clinical-resource-form-submit"
          >
            {isEdit ? t(`${config.i18nKey}.form.submitEdit`) : t(`${config.i18nKey}.form.submitCreate`)}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ClinicalResourceFormScreenAndroid;
