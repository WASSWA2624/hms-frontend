/**
 * FacilityFormScreen - Android
 * Create/edit facility form.
 */
import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
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
  StyledHelperStack,
  StyledInlineStates,
} from './FacilityFormScreen.android.styles';
import useFacilityFormScreen from './useFacilityFormScreen';

const FacilityFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    facilityType,
    setFacilityType,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    nameError,
    typeError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    hasTenants,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    facility,
    onSubmit,
    onCancel,
    onGoToTenants,
    onRetryTenants,
    typeOptions,
    isSubmitDisabled,
  } = useFacilityFormScreen();

  if (isEdit && !facility && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="facility-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !facility) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('facility.form.loadError')}
            action={
              <Button
                variant="primary"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('facility.form.cancelHint')}
              >
                {t('common.back')}
              </Button>
            }
            testID="facility-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && isCreateBlocked);
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="facility-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(facility));
  const showCreateBlocked = !isEdit && isCreateBlocked;

  return (
    <StyledContainer>
      <StyledContent>
        <Text
          variant="h2"
          accessibilityRole="header"
          testID="facility-form-title"
        >
          {isEdit ? t('facility.form.editTitle') : t('facility.form.createTitle')}
        </Text>
        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="facility-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('facility.form.submitErrorTitle')}
              description={errorMessage}
              testID="facility-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('facility.form.nameLabel')} testID="facility-form-card">
          <StyledFormGrid>
            {!isEdit && (
              <StyledFullRow>
                <StyledFieldGroup>
                  {isTenantLocked ? (
                    <TextField
                      label={t('facility.form.tenantLockedLabel')}
                      value={lockedTenantDisplay}
                      accessibilityLabel={t('facility.form.tenantLockedLabel')}
                      accessibilityHint={t('facility.form.tenantLockedHint')}
                      helperText={tenantError || t('facility.form.tenantLockedHint')}
                      errorMessage={tenantError || undefined}
                      required
                      density="compact"
                      disabled
                      testID="facility-form-tenant-locked"
                    />
                  ) : tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="facility-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('facility.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="facility-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      accessibilityLabel={t('facility.form.tenantLabel')}
                      accessibilityRole="summary"
                      testID="facility-form-no-tenants"
                    >
                      <Text variant="body">{t('facility.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('facility.form.createTenantFirst')}</Text>
                      <Button
                        variant="primary"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('facility.form.goToTenants')}
                        accessibilityHint={t('facility.form.goToTenantsHint')}
                        testID="facility-form-go-to-tenants"
                      >
                        {t('facility.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('facility.form.tenantLabel')}
                      placeholder={t('facility.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('facility.form.tenantLabel')}
                      accessibilityHint={t('facility.form.tenantHint')}
                      helperText={tenantError || t('facility.form.tenantHint')}
                      errorMessage={tenantError || undefined}
                      required
                      disabled={isFormDisabled}
                      testID="facility-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('facility.form.nameLabel')}
                placeholder={t('facility.form.namePlaceholder')}
                value={name}
                onChangeText={setName}
                accessibilityLabel={t('facility.form.nameLabel')}
                accessibilityHint={t('facility.form.nameHint')}
                helperText={nameError || (showCreateBlocked ? t('facility.form.blockedMessage') : t('facility.form.nameHint'))}
                errorMessage={nameError || undefined}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="facility-form-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Select
                label={t('facility.form.typeLabel')}
                placeholder={t('facility.form.typePlaceholder')}
                options={typeOptions}
                value={facilityType}
                onValueChange={setFacilityType}
                accessibilityLabel={t('facility.form.typeLabel')}
                accessibilityHint={t('facility.form.typeHint')}
                helperText={typeError || t('facility.form.typeHint')}
                errorMessage={typeError || undefined}
                required
                disabled={isFormDisabled}
                testID="facility-form-type"
              />
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  label={t('facility.form.activeLabel')}
                  accessibilityLabel={t('facility.form.activeLabel')}
                  accessibilityHint={t('facility.form.activeHint')}
                  disabled={isFormDisabled}
                  testID="facility-form-active"
                />
                <Text variant="caption">
                  {showCreateBlocked ? t('facility.form.blockedMessage') : t('facility.form.activeHint')}
                </Text>
              </StyledFieldGroup>
            </StyledFullRow>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="ghost"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('facility.form.cancel')}
            accessibilityHint={t('facility.form.cancelHint')}
            testID="facility-form-cancel"
            disabled={isLoading}
          >
            {t('facility.form.cancel')}
          </Button>
          <Button
            variant="primary"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('facility.form.submitEdit') : t('facility.form.submitCreate')}
            accessibilityHint={isEdit ? t('facility.form.submitEdit') : t('facility.form.submitCreate')}
            testID="facility-form-submit"
          >
            {isEdit ? t('facility.form.submitEdit') : t('facility.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default FacilityFormScreenAndroid;
