/**
 * WardFormScreen - Android
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
  StyledHelperStack,
  StyledInlineStates,
} from './WardFormScreen.android.styles';
import useWardFormScreen from './useWardFormScreen';

const WardFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    wardType,
    setWardType,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    hasTenants,
    hasFacilities,
    isCreateBlocked,
    isFacilityBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    ward,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onRetryTenants,
    onRetryFacilities,
    isSubmitDisabled,
  } = useWardFormScreen();

  if (isEdit && !ward && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="ward-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !ward) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('ward.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('ward.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="ward-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && (isCreateBlocked || isFacilityBlocked));
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="ward-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryFacilitiesAction = onRetryFacilities ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryFacilities}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="ward-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(ward));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const showFacilityBlocked = !isEdit && isFacilityBlocked;
  const showCreateBlocked = showTenantBlocked || showFacilityBlocked;
  const blockedMessage = showFacilityBlocked
    ? t('ward.form.facilityBlockedMessage')
    : t('ward.form.blockedMessage');
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="ward-form-title">
          {isEdit ? t('ward.form.editTitle') : t('ward.form.createTitle')}
        </Text>
        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="ward-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('ward.form.submitErrorTitle')}
              description={errorMessage}
              testID="ward-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('ward.form.nameLabel')} testID="ward-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="ward-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('ward.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="ward-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      accessibilityLabel={t('ward.form.tenantLabel')}
                      accessibilityRole="summary"
                      testID="ward-form-no-tenants"
                    >
                      <Text variant="body">{t('ward.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('ward.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('ward.form.goToTenants')}
                        accessibilityHint={t('ward.form.goToTenantsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="ward-form-go-to-tenants"
                      >
                        {t('ward.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('ward.form.tenantLabel')}
                      placeholder={t('ward.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('ward.form.tenantLabel')}
                      accessibilityHint={t('ward.form.tenantHint')}
                      helperText={t('ward.form.tenantHint')}
                      required
                      disabled={isFormDisabled}
                      testID="ward-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('ward.form.tenantLabel')}
                    value={tenantId}
                    accessibilityLabel={t('ward.form.tenantLabel')}
                    accessibilityHint={t('ward.form.tenantLockedHint')}
                    helperText={t('ward.form.tenantLockedHint')}
                    disabled
                    testID="ward-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {facilityListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="ward-form-facility-loading"
                    />
                  ) : facilityListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('ward.form.facilityLoadErrorTitle')}
                      description={facilityErrorMessage}
                      action={retryFacilitiesAction}
                      testID="ward-form-facility-error"
                    />
                  ) : !tenantId ? (
                    <Select
                      label={t('ward.form.facilityLabel')}
                      placeholder={t('ward.form.facilityPlaceholder')}
                      options={[]}
                      value=""
                      onValueChange={() => {}}
                      accessibilityLabel={t('ward.form.facilityLabel')}
                      accessibilityHint={t('ward.form.selectTenantFirst')}
                      helperText={t('ward.form.selectTenantFirst')}
                      disabled
                      testID="ward-form-select-tenant"
                    />
                  ) : showFacilityEmpty ? (
                    <StyledHelperStack
                      accessibilityLabel={t('ward.form.facilityLabel')}
                      accessibilityRole="summary"
                      testID="ward-form-no-facilities"
                    >
                      <Text variant="body">{t('ward.form.noFacilitiesMessage')}</Text>
                      <Text variant="body">{t('ward.form.createFacilityRequired')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToFacilities}
                        accessibilityLabel={t('ward.form.goToFacilities')}
                        accessibilityHint={t('ward.form.goToFacilitiesHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="ward-form-go-to-facilities"
                      >
                        {t('ward.form.goToFacilities')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('ward.form.facilityLabel')}
                      placeholder={t('ward.form.facilityPlaceholder')}
                      options={facilityOptions}
                      value={facilityId}
                      onValueChange={setFacilityId}
                      accessibilityLabel={t('ward.form.facilityLabel')}
                      accessibilityHint={t('ward.form.facilityHint')}
                      helperText={t('ward.form.facilityHint')}
                      disabled={isFormDisabled}
                      testID="ward-form-facility"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('ward.form.facilityLabel')}
                    value={facilityId}
                    accessibilityLabel={t('ward.form.facilityLabel')}
                    accessibilityHint={t('ward.form.facilityLockedHint')}
                    helperText={t('ward.form.facilityLockedHint')}
                    disabled
                    testID="ward-form-facility-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('ward.form.nameLabel')}
                placeholder={t('ward.form.namePlaceholder')}
                value={name}
                onChangeText={setName}
                accessibilityLabel={t('ward.form.nameLabel')}
                accessibilityHint={t('ward.form.nameHint')}
                helperText={showCreateBlocked ? blockedMessage : t('ward.form.nameHint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="ward-form-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('ward.form.typeLabel')}
                placeholder={t('ward.form.typePlaceholder')}
                value={wardType}
                onChangeText={setWardType}
                accessibilityLabel={t('ward.form.typeLabel')}
                accessibilityHint={t('ward.form.typeHint')}
                helperText={showCreateBlocked ? blockedMessage : t('ward.form.typeHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="ward-form-type"
              />
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  label={t('ward.form.activeLabel')}
                  accessibilityLabel={t('ward.form.activeLabel')}
                  accessibilityHint={t('ward.form.activeHint')}
                  disabled={isFormDisabled}
                  testID="ward-form-active"
                />
                <Text variant="caption">
                  {showCreateBlocked ? blockedMessage : t('ward.form.activeHint')}
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
            accessibilityLabel={t('ward.form.cancel')}
            accessibilityHint={t('ward.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="ward-form-cancel"
            disabled={isLoading}
          >
            {t('ward.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('ward.form.submitEdit') : t('ward.form.submitCreate')}
            accessibilityHint={isEdit ? t('ward.form.submitEdit') : t('ward.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="ward-form-submit"
          >
            {isEdit ? t('ward.form.submitEdit') : t('ward.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default WardFormScreenAndroid;
