/**
 * BranchFormScreen - iOS
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
} from './BranchFormScreen.ios.styles';
import useBranchFormScreen from './useBranchFormScreen';

const BranchFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
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
    branch,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onRetryTenants,
    onRetryFacilities,
    isSubmitDisabled,
  } = useBranchFormScreen();

  if (isEdit && !branch && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="branch-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !branch) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('branch.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('branch.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="branch-form-load-error"
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
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="branch-form-tenant-retry"
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
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="branch-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(branch));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const showFacilityBlocked = !isEdit && isFacilityBlocked;
  const showCreateBlocked = showTenantBlocked || showFacilityBlocked;
  const blockedMessage = showFacilityBlocked
    ? t('branch.form.facilityBlockedMessage')
    : t('branch.form.blockedMessage');
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="branch-form-title">
          {isEdit ? t('branch.form.editTitle') : t('branch.form.createTitle')}
        </Text>
        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="branch-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('branch.form.submitErrorTitle')}
              description={errorMessage}
              testID="branch-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('branch.form.nameLabel')} testID="branch-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="branch-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('branch.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="branch-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      accessibilityLabel={t('branch.form.tenantLabel')}
                      accessibilityRole="summary"
                      testID="branch-form-no-tenants"
                    >
                      <Text variant="body">{t('branch.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('branch.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('branch.form.goToTenants')}
                        accessibilityHint={t('branch.form.goToTenantsHint')}
                        icon={<Icon glyph="→" size="xs" decorative />}
                        testID="branch-form-go-to-tenants"
                      >
                        {t('branch.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('branch.form.tenantLabel')}
                      placeholder={t('branch.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('branch.form.tenantLabel')}
                      accessibilityHint={t('branch.form.tenantHint')}
                      helperText={t('branch.form.tenantHint')}
                      required
                      disabled={isFormDisabled}
                      testID="branch-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('branch.form.tenantLabel')}
                    value={tenantId}
                    accessibilityLabel={t('branch.form.tenantLabel')}
                    accessibilityHint={t('branch.form.tenantLockedHint')}
                    helperText={t('branch.form.tenantLockedHint')}
                    disabled
                    testID="branch-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('branch.form.nameLabel')}
                placeholder={t('branch.form.namePlaceholder')}
                value={name}
                onChangeText={setName}
                accessibilityLabel={t('branch.form.nameLabel')}
                accessibilityHint={t('branch.form.nameHint')}
                helperText={showCreateBlocked ? blockedMessage : t('branch.form.nameHint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="branch-form-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              {facilityListLoading ? (
                <LoadingSpinner
                  accessibilityLabel={t('common.loading')}
                  testID="branch-form-facility-loading"
                />
              ) : facilityListError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('branch.form.facilityLoadErrorTitle')}
                  description={facilityErrorMessage}
                  action={retryFacilitiesAction}
                  testID="branch-form-facility-error"
                />
              ) : !tenantId && !isEdit ? (
                <Select
                  label={t('branch.form.facilityLabel')}
                  placeholder={t('branch.form.facilityPlaceholder')}
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                  accessibilityLabel={t('branch.form.facilityLabel')}
                  accessibilityHint={t('branch.form.selectTenantFirst')}
                  helperText={t('branch.form.selectTenantFirst')}
                  disabled
                  testID="branch-form-select-tenant"
                />
              ) : showFacilityEmpty ? (
                <StyledHelperStack
                  accessibilityLabel={t('branch.form.facilityLabel')}
                  accessibilityRole="summary"
                  testID="branch-form-no-facilities"
                >
                  <Text variant="body">{t('branch.form.noFacilitiesMessage')}</Text>
                  <Text variant="body">{t('branch.form.createFacilityRequired')}</Text>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onGoToFacilities}
                    accessibilityLabel={t('branch.form.goToFacilities')}
                    accessibilityHint={t('branch.form.goToFacilitiesHint')}
                    icon={<Icon glyph="→" size="xs" decorative />}
                    testID="branch-form-go-to-facilities"
                  >
                    {t('branch.form.goToFacilities')}
                  </Button>
                </StyledHelperStack>
              ) : (
                <Select
                  label={t('branch.form.facilityLabel')}
                  placeholder={t('branch.form.facilityPlaceholder')}
                  options={facilityOptions}
                  value={facilityId}
                  onValueChange={setFacilityId}
                  accessibilityLabel={t('branch.form.facilityLabel')}
                  accessibilityHint={t('branch.form.facilityHint')}
                  helperText={t('branch.form.facilityHint')}
                  disabled={isFormDisabled}
                  testID="branch-form-facility"
                />
              )}
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  label={t('branch.form.activeLabel')}
                  accessibilityLabel={t('branch.form.activeLabel')}
                  accessibilityHint={t('branch.form.activeHint')}
                  disabled={isFormDisabled}
                  testID="branch-form-active"
                />
                <Text variant="caption">
                  {showCreateBlocked ? blockedMessage : t('branch.form.activeHint')}
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
            accessibilityLabel={t('branch.form.cancel')}
            accessibilityHint={t('branch.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="branch-form-cancel"
            disabled={isLoading}
          >
            {t('branch.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('branch.form.submitEdit') : t('branch.form.submitCreate')}
            accessibilityHint={isEdit ? t('branch.form.submitEdit') : t('branch.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
            testID="branch-form-submit"
          >
            {isEdit ? t('branch.form.submitEdit') : t('branch.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default BranchFormScreenIOS;
