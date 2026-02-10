/**
 * UnitFormScreen - iOS
 */
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
} from './UnitFormScreen.ios.styles';
import useUnitFormScreen from './useUnitFormScreen';

const UnitFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    unit,
    onSubmit,
    onCancel,
    onGoToTenants,
    onRetryTenants,
    isSubmitDisabled,
  } = useUnitFormScreen();

  if (isEdit && !unit && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="unit-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !unit) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('unit.form.loadError')}
            action={
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('unit.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            }
            testID="unit-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const showInlineError = hasError && (!isEdit || Boolean(unit));
  const isFormDisabled = isLoading;
  const showCreateBlocked = !isEdit && isCreateBlocked;
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="unit-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="unit-form-title">
          {isEdit ? t('unit.form.editTitle') : t('unit.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="unit-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('unit.form.submitErrorTitle')}
              description={errorMessage}
              testID="unit-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('unit.form.nameLabel')} testID="unit-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="unit-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('unit.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="unit-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <>
                      <Text variant="body">{t('unit.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('unit.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('unit.form.goToTenants')}
                        accessibilityHint={t('unit.form.goToTenantsHint')}
                        icon={<Icon glyph="→" size="xs" decorative />}
                        testID="unit-form-go-to-tenants"
                      >
                        {t('unit.form.goToTenants')}
                      </Button>
                    </>
                  ) : (
                    <Select
                      label={t('unit.form.tenantLabel')}
                      placeholder={t('unit.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('unit.form.tenantLabel')}
                      accessibilityHint={t('unit.form.tenantHint')}
                      helperText={t('unit.form.tenantHint')}
                      required
                      compact
                      disabled={isFormDisabled || isCreateBlocked}
                      testID="unit-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('unit.form.tenantIdLabel')}
                    value={tenantId}
                    accessibilityLabel={t('unit.form.tenantIdLabel')}
                    accessibilityHint={t('unit.form.tenantLockedHint')}
                    helperText={t('unit.form.tenantLockedHint')}
                    disabled
                    testID="unit-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('unit.form.nameLabel')}
                placeholder={t('unit.form.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                accessibilityLabel={t('unit.form.nameLabel')}
                accessibilityHint={t('unit.form.nameHint')}
                helperText={showCreateBlocked ? t('unit.form.tenantRequiredMessage') : t('unit.form.nameHint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="unit-form-name"
              />
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  label={t('unit.form.activeLabel')}
                  accessibilityLabel={t('unit.form.activeLabel')}
                  accessibilityHint={t('unit.form.activeHint')}
                  disabled={isFormDisabled}
                  testID="unit-form-active"
                />
                <Text variant="caption">
                  {showCreateBlocked ? t('unit.form.tenantRequiredMessage') : t('unit.form.activeHint')}
                </Text>
              </StyledFieldGroup>
            </StyledFullRow>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('unit.form.cancel')}
            accessibilityHint={t('unit.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="unit-form-cancel"
            disabled={isLoading}
          >
            {t('unit.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('unit.form.submitEdit') : t('unit.form.submitCreate')}
            accessibilityHint={isEdit ? t('unit.form.submitEdit') : t('unit.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
            testID="unit-form-submit"
          >
            {isEdit ? t('unit.form.submitEdit') : t('unit.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UnitFormScreenIOS;
