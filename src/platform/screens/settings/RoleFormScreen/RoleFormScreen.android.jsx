/**
 * RoleFormScreen - Android
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
  StyledHelperStack,
  StyledInlineStates,
} from './RoleFormScreen.android.styles';
import useRoleFormScreen from './useRoleFormScreen';

const RoleFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    name,
    setName,
    description,
    setDescription,
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
    role,
    nameError,
    descriptionError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onRetryTenants,
    onRetryFacilities,
    isSubmitDisabled,
  } = useRoleFormScreen();

  if (isEdit && !role && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="role-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !role) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('role.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('role.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="role-form-load-error"
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
      testID="role-form-tenant-retry"
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
      testID="role-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(role));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const showFacilityBlocked = !isEdit && isFacilityBlocked;
  const showCreateBlocked = showTenantBlocked || showFacilityBlocked;
  const blockedMessage = showFacilityBlocked
    ? t('role.form.facilityBlockedMessage')
    : t('role.form.blockedMessage');
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;
  const nameHelperText = nameError || (showCreateBlocked ? blockedMessage : t('role.form.nameHint'));
  const descriptionHelperText = descriptionError || (showCreateBlocked
    ? blockedMessage
    : t('role.form.descriptionHint'));
  const tenantHelperText = tenantError || t('role.form.tenantHint');
  const tenantLockedHint = isEdit ? t('role.form.tenantLockedHint') : t('role.form.tenantScopedHint');

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="role-form-title">
          {isEdit ? t('role.form.editTitle') : t('role.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="role-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('role.form.submitErrorTitle')}
              description={errorMessage}
              testID="role-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('role.form.nameLabel')} testID="role-form-card">
          <StyledFormGrid>
            {!isEdit && !isTenantLocked ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="role-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('role.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="role-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack>
                      <Text variant="body">{t('role.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('role.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('role.form.goToTenants')}
                        accessibilityHint={t('role.form.goToTenantsHint')}
                        icon={<Icon glyph="→" size="xs" decorative />}
                        testID="role-form-go-to-tenants"
                      >
                        {t('role.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('role.form.tenantLabel')}
                      placeholder={t('role.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('role.form.tenantLabel')}
                      accessibilityHint={t('role.form.tenantHint')}
                      errorMessage={tenantError}
                      helperText={tenantHelperText}
                      required
                      disabled={isFormDisabled}
                      testID="role-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('role.form.tenantLabel')}
                    value={isEdit ? tenantId : lockedTenantDisplay}
                    accessibilityLabel={t('role.form.tenantLabel')}
                    accessibilityHint={tenantLockedHint}
                    helperText={tenantLockedHint}
                    disabled
                    testID="role-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFullRow>
              <StyledFieldGroup>
                {facilityListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="role-form-facility-loading"
                  />
                ) : facilityListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('role.form.facilityLoadErrorTitle')}
                    description={facilityErrorMessage}
                    action={retryFacilitiesAction}
                    testID="role-form-facility-error"
                  />
                ) : !tenantId && !isEdit ? (
                  <Select
                    label={t('role.form.facilityLabel')}
                    placeholder={t('role.form.facilityPlaceholder')}
                    options={[]}
                    value=""
                    onValueChange={() => {}}
                    accessibilityLabel={t('role.form.facilityLabel')}
                    accessibilityHint={t('role.form.selectTenantFirst')}
                    helperText={t('role.form.selectTenantFirst')}
                    disabled
                    testID="role-form-select-tenant"
                  />
                ) : showFacilityEmpty ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('role.form.noFacilitiesMessage')}</Text>
                    <Text variant="body">{t('role.form.createFacilityOptional')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToFacilities}
                      accessibilityLabel={t('role.form.goToFacilities')}
                      accessibilityHint={t('role.form.goToFacilitiesHint')}
                      icon={<Icon glyph=">" size="xs" decorative />}
                      testID="role-form-go-to-facilities"
                    >
                      {t('role.form.goToFacilities')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('role.form.facilityLabel')}
                    placeholder={t('role.form.facilityPlaceholder')}
                    options={facilityOptions}
                    value={facilityId}
                    onValueChange={setFacilityId}
                    accessibilityLabel={t('role.form.facilityLabel')}
                    accessibilityHint={t('role.form.facilityHint')}
                    helperText={t('role.form.facilityHint')}
                    disabled={isFormDisabled}
                    testID="role-form-facility"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFieldGroup>
              <TextField
                label={t('role.form.nameLabel')}
                placeholder={t('role.form.namePlaceholder')}
                value={name}
                onChangeText={setName}
                accessibilityLabel={t('role.form.nameLabel')}
                accessibilityHint={t('role.form.nameHint')}
                errorMessage={nameError}
                helperText={nameHelperText}
                required
                maxLength={120}
                disabled={isFormDisabled}
                testID="role-form-name"
              />
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <TextArea
                  label={t('role.form.descriptionLabel')}
                  placeholder={t('role.form.descriptionPlaceholder')}
                  value={description}
                  onChangeText={setDescription}
                  accessibilityLabel={t('role.form.descriptionLabel')}
                  accessibilityHint={t('role.form.descriptionHint')}
                  errorMessage={descriptionError}
                  helperText={descriptionHelperText}
                  maxLength={255}
                  disabled={isFormDisabled}
                  testID="role-form-description"
                />
              </StyledFieldGroup>
            </StyledFullRow>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('role.form.cancel')}
            accessibilityHint={t('role.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="role-form-cancel"
            disabled={isLoading}
          >
            {t('role.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('role.form.submitEdit') : t('role.form.submitCreate')}
            accessibilityHint={isEdit ? t('role.form.submitEdit') : t('role.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
            testID="role-form-submit"
          >
            {isEdit ? t('role.form.submitEdit') : t('role.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoleFormScreenAndroid;
