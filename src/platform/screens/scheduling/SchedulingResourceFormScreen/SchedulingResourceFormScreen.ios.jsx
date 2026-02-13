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
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledInlineStates,
} from './SchedulingResourceFormScreen.ios.styles';
import useSchedulingResourceFormScreen from './useSchedulingResourceFormScreen';

const SchedulingResourceFormScreenIOS = ({ resourceId }) => {
  const { t } = useI18n();
  const {
    config,
    isEdit,
    values,
    setFieldValue,
    errors,
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
  } = useSchedulingResourceFormScreen(resourceId);

  if (!config) return null;

  if (isEdit && !record && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-resource-form-loading" />
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
            testID="scheduling-resource-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="scheduling-resource-form-title">
          {isEdit ? t(`${config.i18nKey}.form.editTitle`) : t(`${config.i18nKey}.form.createTitle`)}
        </Text>

        <StyledInlineStates>
          {isOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="scheduling-resource-form-offline"
            />
          ) : null}

          {hasError && (isEdit ? Boolean(record) : true) ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t(`${config.i18nKey}.form.submitErrorTitle`)}
              description={submitErrorMessage}
              testID="scheduling-resource-form-submit-error"
            />
          ) : null}
        </StyledInlineStates>

        <Card
          variant="outlined"
          accessibilityLabel={t(`${config.i18nKey}.form.cardLabel`)}
          testID="scheduling-resource-form-card"
        >
          <StyledFormGrid>
            {config.requiresTenant ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('scheduling.common.form.tenantLabel')}
                    value={values.tenant_id || ''}
                    onChangeText={(nextValue) => setFieldValue('tenant_id', nextValue)}
                    accessibilityLabel={t('scheduling.common.form.tenantLabel')}
                    accessibilityHint={tenantHint}
                    helperText={errors.tenant_id || tenantHint}
                    errorMessage={errors.tenant_id}
                    required
                    disabled={tenantLocked || isLoading}
                    testID="scheduling-resource-form-tenant"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            ) : null}

            {config.fields.map((field) => {
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
                      testID={`scheduling-resource-form-${field.name}`}
                    />
                  </StyledFieldGroup>
                );
              }

              if (field.type === 'select') {
                const selectOptions = (field.options || []).map((option) => ({
                  value: option.value,
                  label: t(option.labelKey),
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
                      accessibilityHint={t(field.hintKey)}
                      helperText={fieldError || t(field.hintKey)}
                      errorMessage={fieldError}
                      required={Boolean(field.required)}
                      compact
                      disabled={isLoading}
                      testID={`scheduling-resource-form-${field.name}`}
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
                    accessibilityHint={t(field.hintKey)}
                    helperText={fieldError || t(field.hintKey)}
                    errorMessage={fieldError}
                    required={Boolean(field.required)}
                    maxLength={field.maxLength}
                    density="compact"
                    disabled={isLoading}
                    testID={`scheduling-resource-form-${field.name}`}
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
            testID="scheduling-resource-form-cancel"
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
            testID="scheduling-resource-form-submit"
          >
            {isEdit ? t(`${config.i18nKey}.form.submitEdit`) : t(`${config.i18nKey}.form.submitCreate`)}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default SchedulingResourceFormScreenIOS;
