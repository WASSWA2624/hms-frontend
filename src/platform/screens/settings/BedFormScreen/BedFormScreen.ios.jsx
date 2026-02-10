/**
 * BedFormScreen - iOS
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
} from './BedFormScreen.ios.styles';
import useBedFormScreen from './useBedFormScreen';

const BedFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    label,
    setLabel,
    status,
    setStatus,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    wardId,
    setWardId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    wardOptions,
    wardListLoading,
    wardListError,
    wardErrorMessage,
    hasTenants,
    hasFacilities,
    hasWards,
    isCreateBlocked,
    isFacilityBlocked,
    isWardBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    bed,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onGoToWards,
    onRetryTenants,
    onRetryFacilities,
    onRetryWards,
    isSubmitDisabled,
  } = useBedFormScreen();

  if (isEdit && !bed && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="bed-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !bed) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('bed.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('bed.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="bed-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && (isCreateBlocked || isFacilityBlocked || isWardBlocked));
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="bed-form-tenant-retry"
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
      testID="bed-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryWardsAction = onRetryWards ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryWards}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="bed-form-ward-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(bed));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const showFacilityBlocked = !isEdit && isFacilityBlocked;
  const showWardBlocked = !isEdit && isWardBlocked;
  const showCreateBlocked = showTenantBlocked || showFacilityBlocked || showWardBlocked;
  const blockedMessage = showWardBlocked
    ? t('bed.form.wardBlockedMessage')
    : showFacilityBlocked
      ? t('bed.form.facilityBlockedMessage')
      : t('bed.form.blockedMessage');
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;
  const showWardEmpty = Boolean(facilityId) && !wardListLoading && !wardListError && !hasWards;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="bed-form-title">
          {isEdit ? t('bed.form.editTitle') : t('bed.form.createTitle')}
        </Text>
        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="bed-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('bed.form.submitErrorTitle')}
              description={errorMessage}
              testID="bed-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('bed.form.labelLabel')} testID="bed-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="bed-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('bed.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="bed-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      accessibilityLabel={t('bed.form.tenantLabel')}
                      accessibilityRole="summary"
                      testID="bed-form-no-tenants"
                    >
                      <Text variant="body">{t('bed.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('bed.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('bed.form.goToTenants')}
                        accessibilityHint={t('bed.form.goToTenantsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="bed-form-go-to-tenants"
                      >
                        {t('bed.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('bed.form.tenantLabel')}
                      placeholder={t('bed.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('bed.form.tenantLabel')}
                      accessibilityHint={t('bed.form.tenantHint')}
                      helperText={t('bed.form.tenantHint')}
                      required
                      disabled={isFormDisabled}
                      testID="bed-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('bed.form.tenantLabel')}
                    value={tenantId}
                    accessibilityLabel={t('bed.form.tenantLabel')}
                    accessibilityHint={t('bed.form.tenantLockedHint')}
                    helperText={t('bed.form.tenantLockedHint')}
                    disabled
                    testID="bed-form-tenant-readonly"
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
                      testID="bed-form-facility-loading"
                    />
                  ) : facilityListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('bed.form.facilityLoadErrorTitle')}
                      description={facilityErrorMessage}
                      action={retryFacilitiesAction}
                      testID="bed-form-facility-error"
                    />
                  ) : !tenantId ? (
                    <Select
                      label={t('bed.form.facilityLabel')}
                      placeholder={t('bed.form.facilityPlaceholder')}
                      options={[]}
                      value=""
                      onValueChange={() => {}}
                      accessibilityLabel={t('bed.form.facilityLabel')}
                      accessibilityHint={t('bed.form.selectTenantFirst')}
                      helperText={t('bed.form.selectTenantFirst')}
                      disabled
                      testID="bed-form-select-tenant"
                    />
                  ) : showFacilityEmpty ? (
                    <StyledHelperStack
                      accessibilityLabel={t('bed.form.facilityLabel')}
                      accessibilityRole="summary"
                      testID="bed-form-no-facilities"
                    >
                      <Text variant="body">{t('bed.form.noFacilitiesMessage')}</Text>
                      <Text variant="body">{t('bed.form.createFacilityRequired')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToFacilities}
                        accessibilityLabel={t('bed.form.goToFacilities')}
                        accessibilityHint={t('bed.form.goToFacilitiesHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="bed-form-go-to-facilities"
                      >
                        {t('bed.form.goToFacilities')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('bed.form.facilityLabel')}
                      placeholder={t('bed.form.facilityPlaceholder')}
                      options={facilityOptions}
                      value={facilityId}
                      onValueChange={setFacilityId}
                      accessibilityLabel={t('bed.form.facilityLabel')}
                      accessibilityHint={t('bed.form.facilityHint')}
                      helperText={t('bed.form.facilityHint')}
                      required
                      disabled={isFormDisabled}
                      testID="bed-form-facility"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('bed.form.facilityLabel')}
                    value={facilityId}
                    accessibilityLabel={t('bed.form.facilityLabel')}
                    accessibilityHint={t('bed.form.facilityLockedHint')}
                    helperText={t('bed.form.facilityLockedHint')}
                    disabled
                    testID="bed-form-facility-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {wardListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="bed-form-ward-loading"
                    />
                  ) : wardListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('bed.form.wardLoadErrorTitle')}
                      description={wardErrorMessage}
                      action={retryWardsAction}
                      testID="bed-form-ward-error"
                    />
                  ) : !facilityId ? (
                    <Select
                      label={t('bed.form.wardLabel')}
                      placeholder={t('bed.form.wardPlaceholder')}
                      options={[]}
                      value=""
                      onValueChange={() => {}}
                      accessibilityLabel={t('bed.form.wardLabel')}
                      accessibilityHint={t('bed.form.selectFacilityFirst')}
                      helperText={t('bed.form.selectFacilityFirst')}
                      disabled
                      testID="bed-form-select-facility"
                    />
                  ) : showWardEmpty ? (
                    <StyledHelperStack
                      accessibilityLabel={t('bed.form.wardLabel')}
                      accessibilityRole="summary"
                      testID="bed-form-no-wards"
                    >
                      <Text variant="body">{t('bed.form.noWardsMessage')}</Text>
                      <Text variant="body">{t('bed.form.createWardRequired')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToWards}
                        accessibilityLabel={t('bed.form.goToWards')}
                        accessibilityHint={t('bed.form.goToWardsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="bed-form-go-to-wards"
                      >
                        {t('bed.form.goToWards')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('bed.form.wardLabel')}
                      placeholder={t('bed.form.wardPlaceholder')}
                      options={wardOptions}
                      value={wardId}
                      onValueChange={setWardId}
                      accessibilityLabel={t('bed.form.wardLabel')}
                      accessibilityHint={t('bed.form.wardHint')}
                      helperText={t('bed.form.wardHint')}
                      required
                      disabled={isFormDisabled}
                      testID="bed-form-ward"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('bed.form.wardLabel')}
                    value={wardId}
                    accessibilityLabel={t('bed.form.wardLabel')}
                    accessibilityHint={t('bed.form.wardLockedHint')}
                    helperText={t('bed.form.wardLockedHint')}
                    disabled
                    testID="bed-form-ward-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('bed.form.labelLabel')}
                placeholder={t('bed.form.labelPlaceholder')}
                value={label}
                onChangeText={setLabel}
                accessibilityLabel={t('bed.form.labelLabel')}
                accessibilityHint={t('bed.form.labelHint')}
                helperText={showCreateBlocked ? blockedMessage : t('bed.form.labelHint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="bed-form-label"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('bed.form.statusLabel')}
                placeholder={t('bed.form.statusPlaceholder')}
                value={status}
                onChangeText={setStatus}
                accessibilityLabel={t('bed.form.statusLabel')}
                accessibilityHint={t('bed.form.statusHint')}
                helperText={showCreateBlocked ? blockedMessage : t('bed.form.statusHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="bed-form-status"
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('bed.form.cancel')}
            accessibilityHint={t('bed.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="bed-form-cancel"
            disabled={isLoading}
          >
            {t('bed.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('bed.form.submitEdit') : t('bed.form.submitCreate')}
            accessibilityHint={isEdit ? t('bed.form.submitEdit') : t('bed.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="bed-form-submit"
          >
            {isEdit ? t('bed.form.submitEdit') : t('bed.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default BedFormScreenIOS;
