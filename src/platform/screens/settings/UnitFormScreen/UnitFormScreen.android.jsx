/**
 * UnitFormScreen - Android
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
} from './UnitFormScreen.android.styles';
import useUnitFormScreen from './useUnitFormScreen';

const UnitFormScreenAndroid = () => {
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
    departmentId,
    setDepartmentId,
    tenantOptions,
    facilityOptions,
    departmentOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    departmentListLoading,
    departmentListError,
    departmentErrorMessage,
    hasTenants,
    hasFacilities,
    hasDepartments,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    unit,
    nameError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onGoToDepartments,
    onRetryTenants,
    onRetryFacilities,
    onRetryDepartments,
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
            action={(
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
            )}
            testID="unit-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && isCreateBlocked);
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
  const retryFacilitiesAction = onRetryFacilities ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryFacilities}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="unit-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryDepartmentsAction = onRetryDepartments ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryDepartments}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="unit-form-department-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const showInlineError = hasError && (!isEdit || Boolean(unit));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const blockedMessage = t('unit.form.blockedMessage');
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;
  const showDepartmentEmpty =
    Boolean(tenantId) && !departmentListLoading && !departmentListError && !hasDepartments;
  const nameHelperText = nameError || (showTenantBlocked ? blockedMessage : t('unit.form.nameHint'));
  const tenantHelperText = tenantError || t('unit.form.tenantHint');
  const tenantLockedHint = isEdit ? t('unit.form.tenantLockedHint') : t('unit.form.tenantScopedHint');

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
            {!isEdit && !isTenantLocked ? (
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
                    <StyledHelperStack>
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
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('unit.form.tenantLabel')}
                      placeholder={t('unit.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('unit.form.tenantLabel')}
                      accessibilityHint={t('unit.form.tenantHint')}
                      errorMessage={tenantError}
                      helperText={tenantHelperText}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="unit-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('unit.form.tenantLabel')}
                    value={isEdit ? tenantId : lockedTenantDisplay}
                    accessibilityLabel={t('unit.form.tenantLabel')}
                    accessibilityHint={tenantLockedHint}
                    helperText={tenantLockedHint}
                    disabled
                    testID="unit-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              {facilityListLoading ? (
                <LoadingSpinner
                  accessibilityLabel={t('common.loading')}
                  testID="unit-form-facility-loading"
                />
              ) : facilityListError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('unit.form.facilityLoadErrorTitle')}
                  description={facilityErrorMessage}
                  action={retryFacilitiesAction}
                  testID="unit-form-facility-error"
                />
              ) : !tenantId && !isEdit ? (
                <Select
                  label={t('unit.form.facilityLabel')}
                  placeholder={t('unit.form.facilityPlaceholder')}
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                  accessibilityLabel={t('unit.form.facilityLabel')}
                  accessibilityHint={t('unit.form.selectTenantFirst')}
                  helperText={t('unit.form.selectTenantFirst')}
                  compact
                  disabled
                  testID="unit-form-select-tenant"
                />
              ) : showFacilityEmpty ? (
                <StyledHelperStack>
                  <Text variant="body">{t('unit.form.noFacilitiesMessage')}</Text>
                  <Text variant="body">{t('unit.form.createFacilityOptional')}</Text>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onGoToFacilities}
                    accessibilityLabel={t('unit.form.goToFacilities')}
                    accessibilityHint={t('unit.form.goToFacilitiesHint')}
                    icon={<Icon glyph="→" size="xs" decorative />}
                    testID="unit-form-go-to-facilities"
                  >
                    {t('unit.form.goToFacilities')}
                  </Button>
                </StyledHelperStack>
              ) : (
                <Select
                  label={t('unit.form.facilityLabel')}
                  placeholder={t('unit.form.facilityPlaceholder')}
                  options={facilityOptions}
                  value={facilityId}
                  onValueChange={setFacilityId}
                  accessibilityLabel={t('unit.form.facilityLabel')}
                  accessibilityHint={t('unit.form.facilityHint')}
                  helperText={t('unit.form.facilityHint')}
                  compact
                  disabled={isFormDisabled || (!isEdit && !tenantId)}
                  testID="unit-form-facility"
                />
              )}
            </StyledFieldGroup>

            <StyledFieldGroup>
              {departmentListLoading ? (
                <LoadingSpinner
                  accessibilityLabel={t('common.loading')}
                  testID="unit-form-department-loading"
                />
              ) : departmentListError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('unit.form.departmentLoadErrorTitle')}
                  description={departmentErrorMessage}
                  action={retryDepartmentsAction}
                  testID="unit-form-department-error"
                />
              ) : !tenantId && !isEdit ? (
                <Select
                  label={t('unit.form.departmentLabel')}
                  placeholder={t('unit.form.departmentPlaceholder')}
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                  accessibilityLabel={t('unit.form.departmentLabel')}
                  accessibilityHint={t('unit.form.selectTenantFirst')}
                  helperText={t('unit.form.selectTenantFirst')}
                  compact
                  disabled
                  testID="unit-form-select-tenant-department"
                />
              ) : showDepartmentEmpty ? (
                <StyledHelperStack>
                  <Text variant="body">{t('unit.form.noDepartmentsMessage')}</Text>
                  <Text variant="body">{t('unit.form.createDepartmentOptional')}</Text>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onGoToDepartments}
                    accessibilityLabel={t('unit.form.goToDepartments')}
                    accessibilityHint={t('unit.form.goToDepartmentsHint')}
                    icon={<Icon glyph="→" size="xs" decorative />}
                    testID="unit-form-go-to-departments"
                  >
                    {t('unit.form.goToDepartments')}
                  </Button>
                </StyledHelperStack>
              ) : (
                <Select
                  label={t('unit.form.departmentLabel')}
                  placeholder={t('unit.form.departmentPlaceholder')}
                  options={departmentOptions}
                  value={departmentId}
                  onValueChange={setDepartmentId}
                  accessibilityLabel={t('unit.form.departmentLabel')}
                  accessibilityHint={t('unit.form.departmentHint')}
                  helperText={facilityId ? t('unit.form.departmentHint') : t('unit.form.departmentHintNoFacility')}
                  compact
                  disabled={isFormDisabled || (!isEdit && !tenantId)}
                  testID="unit-form-department"
                />
              )}
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('unit.form.nameLabel')}
                placeholder={t('unit.form.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                accessibilityLabel={t('unit.form.nameLabel')}
                accessibilityHint={t('unit.form.nameHint')}
                errorMessage={nameError}
                helperText={nameHelperText}
                required
                maxLength={255}
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
                  {showTenantBlocked ? blockedMessage : t('unit.form.activeHint')}
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

export default UnitFormScreenAndroid;
