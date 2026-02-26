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
  StyledLookupStack,
  StyledRepeaterGrid,
  StyledRepeaterHeader,
  StyledRepeaterItem,
  StyledRepeaterStack,
} from './SchedulingResourceFormScreen.android.styles';
import useSchedulingResourceFormScreen from './useSchedulingResourceFormScreen';

const SchedulingResourceFormScreenAndroid = ({ resourceId }) => {
  const { t } = useI18n();
  const {
    config,
    isEdit,
    values,
    setFieldValue,
    setLookupQuery,
    lookupStateByField,
    addRepeaterItem,
    removeRepeaterItem,
    setRepeaterFieldValue,
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

              if (field.type === 'lookup') {
                const lookupState = lookupStateByField[field.name] || {};
                const lookupSearchLabel = t('scheduling.common.form.lookupSearchLabel', {
                  field: t(field.labelKey),
                });
                return (
                  <StyledFieldGroup key={field.name}>
                    <StyledLookupStack>
                      <TextField
                        label={lookupSearchLabel}
                        placeholder={t('scheduling.common.form.lookupSearchPlaceholder')}
                        value={lookupState.query || ''}
                        onChangeText={(nextValue) => setLookupQuery(field.name, nextValue)}
                        accessibilityLabel={lookupSearchLabel}
                        accessibilityHint={t('scheduling.common.form.lookupSearchHint')}
                        helperText={lookupState.isLoading ? t('common.loading') : t('scheduling.common.form.lookupSearchHint')}
                        density="compact"
                        disabled={isLoading}
                        testID={`scheduling-resource-form-${field.name}-search`}
                      />
                      <Select
                        label={t(field.labelKey)}
                        placeholder={t(field.placeholderKey)}
                        options={lookupState.options || []}
                        value={fieldValue || ''}
                        onValueChange={(nextValue) => setFieldValue(field.name, nextValue)}
                        accessibilityLabel={t(field.labelKey)}
                        accessibilityHint={t(field.hintKey)}
                        helperText={fieldError || lookupState.error || t(field.hintKey)}
                        errorMessage={fieldError}
                        required={Boolean(field.required)}
                        compact
                        disabled={isLoading}
                        testID={`scheduling-resource-form-${field.name}`}
                      />
                    </StyledLookupStack>
                  </StyledFieldGroup>
                );
              }

              if (field.type === 'repeater') {
                const repeaterItems = Array.isArray(fieldValue) ? fieldValue : [];
                return (
                  <StyledFullRow key={field.name}>
                    <StyledFieldGroup>
                      <Text variant="body">{t(field.labelKey)}</Text>
                      <Text variant="body">{t(field.hintKey)}</Text>
                      <StyledRepeaterStack>
                        {repeaterItems.map((item, index) => (
                          <StyledRepeaterItem key={`${field.name}-${index}`}>
                            <StyledRepeaterHeader>
                              <Text variant="body">
                                {t(field.itemLabelKey || 'scheduling.common.form.repeaterRowLabel', {
                                  index: index + 1,
                                })}
                              </Text>
                              <Button
                                variant="surface"
                                size="small"
                                onPress={() => removeRepeaterItem(field.name, index)}
                                accessibilityLabel={t(field.removeLabelKey || 'scheduling.common.form.removeRow')}
                                accessibilityHint={t(field.removeLabelKey || 'scheduling.common.form.removeRow')}
                                testID={`scheduling-resource-form-${field.name}-remove-${index}`}
                                disabled={isLoading}
                              >
                                {t(field.removeLabelKey || 'scheduling.common.form.removeRow')}
                              </Button>
                            </StyledRepeaterHeader>
                            <StyledRepeaterGrid>
                              {(field.fields || []).map((itemField) => {
                                const itemValue = item?.[itemField.name];
                                const itemError = errors[`${field.name}.${index}.${itemField.name}`];

                                if (itemField.type === 'switch') {
                                  return (
                                    <StyledFieldGroup key={`${field.name}-${index}-${itemField.name}`}>
                                      <Switch
                                        value={Boolean(itemValue)}
                                        onValueChange={(nextValue) =>
                                          setRepeaterFieldValue(field.name, index, itemField.name, nextValue)
                                        }
                                        label={t(itemField.labelKey)}
                                        accessibilityLabel={t(itemField.labelKey)}
                                        accessibilityHint={t(itemField.hintKey)}
                                        disabled={isLoading}
                                        testID={`scheduling-resource-form-${field.name}-${index}-${itemField.name}`}
                                      />
                                    </StyledFieldGroup>
                                  );
                                }

                                return (
                                  <StyledFieldGroup key={`${field.name}-${index}-${itemField.name}`}>
                                    <TextField
                                      label={t(itemField.labelKey)}
                                      placeholder={t(itemField.placeholderKey)}
                                      value={itemValue || ''}
                                      onChangeText={(nextValue) =>
                                        setRepeaterFieldValue(field.name, index, itemField.name, nextValue)
                                      }
                                      type={itemField.type === 'datetime' ? 'text' : undefined}
                                      accessibilityLabel={t(itemField.labelKey)}
                                      accessibilityHint={t(itemField.hintKey)}
                                      helperText={itemError || t(itemField.hintKey)}
                                      errorMessage={itemError}
                                      required={Boolean(itemField.required)}
                                      density="compact"
                                      disabled={isLoading}
                                      testID={`scheduling-resource-form-${field.name}-${index}-${itemField.name}`}
                                    />
                                  </StyledFieldGroup>
                                );
                              })}
                            </StyledRepeaterGrid>
                          </StyledRepeaterItem>
                        ))}
                        <Button
                          variant="surface"
                          size="small"
                          onPress={() => addRepeaterItem(field.name)}
                          accessibilityLabel={t(field.addLabelKey || 'scheduling.common.form.addRow')}
                          accessibilityHint={t(field.addLabelKey || 'scheduling.common.form.addRow')}
                          testID={`scheduling-resource-form-${field.name}-add`}
                          disabled={isLoading}
                        >
                          {t(field.addLabelKey || 'scheduling.common.form.addRow')}
                        </Button>
                      </StyledRepeaterStack>
                    </StyledFieldGroup>
                  </StyledFullRow>
                );
              }

              return (
                <StyledFieldGroup key={field.name}>
                  <TextField
                    label={t(field.labelKey)}
                    placeholder={t(field.placeholderKey)}
                    value={fieldValue || ''}
                    onChangeText={(nextValue) => setFieldValue(field.name, nextValue)}
                    type={field.type === 'datetime' ? 'text' : undefined}
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

export default SchedulingResourceFormScreenAndroid;
