/**
 * DepartmentFormScreen - iOS
 * Create/edit department form.
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
} from './DepartmentFormScreen.ios.styles';
import useDepartmentFormScreen from './useDepartmentFormScreen';

const DepartmentFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    shortName,
    setShortName,
    departmentType,
    setDepartmentType,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    nameError,
    shortNameError,
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
    department,
    onSubmit,
    onCancel,
    onGoToTenants,
    onRetryTenants,
    typeOptions,
    isSubmitDisabled,
  } = useDepartmentFormScreen();

  if (isEdit && !department && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="department-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !department) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('department.form.loadError')}
            action={
              <Button
                variant="primary"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('department.form.cancelHint')}
              >
                {t('common.back')}
              </Button>
            }
            testID="department-form-load-error"
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
      testID="department-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(department));
  const showCreateBlocked = !isEdit && isCreateBlocked;

  return (
    <StyledContainer>
      <StyledContent>
        <Text
          variant="h2"
          accessibilityRole="header"
          testID="department-form-title"
        >
          {isEdit ? t('department.form.editTitle') : t('department.form.createTitle')}
        </Text>
        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="department-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('department.form.submitErrorTitle')}
              description={errorMessage}
              testID="department-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('department.form.nameLabel')} testID="department-form-card">
          <StyledFormGrid>
            {!isEdit && (
              <StyledFullRow>
                <StyledFieldGroup>
                  {isTenantLocked ? (
                    <TextField
                      label={t('department.form.tenantLockedLabel')}
                      value={lockedTenantDisplay}
                      accessibilityLabel={t('department.form.tenantLockedLabel')}
                      accessibilityHint={t('department.form.tenantLockedHint')}
                      helperText={tenantError || t('department.form.tenantLockedHint')}
                      errorMessage={tenantError || undefined}
                      required
                      density="compact"
                      disabled
                      testID="department-form-tenant-locked"
                    />
                  ) : tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="department-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('department.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="department-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      accessibilityLabel={t('department.form.tenantLabel')}
                      accessibilityRole="summary"
                      testID="department-form-no-tenants"
                    >
                      <Text variant="body">{t('department.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('department.form.createTenantFirst')}</Text>
                      <Button
                        variant="primary"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('department.form.goToTenants')}
                        accessibilityHint={t('department.form.goToTenantsHint')}
                        testID="department-form-go-to-tenants"
                      >
                        {t('department.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('department.form.tenantLabel')}
                      placeholder={t('department.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('department.form.tenantLabel')}
                      accessibilityHint={t('department.form.tenantHint')}
                      helperText={tenantError || t('department.form.tenantHint')}
                      errorMessage={tenantError || undefined}
                      required
                      disabled={isFormDisabled}
                      testID="department-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('department.form.nameLabel')}
                placeholder={t('department.form.namePlaceholder')}
                value={name}
                onChangeText={setName}
                accessibilityLabel={t('department.form.nameLabel')}
                accessibilityHint={t('department.form.nameHint')}
                helperText={nameError || (showCreateBlocked ? t('department.form.blockedMessage') : t('department.form.nameHint'))}
                errorMessage={nameError || undefined}
                required
                maxLength={255}
                density="compact"
                disabled={isFormDisabled}
                testID="department-form-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('department.form.shortNameLabel')}
                placeholder={t('department.form.shortNamePlaceholder')}
                value={shortName}
                onChangeText={setShortName}
                accessibilityLabel={t('department.form.shortNameLabel')}
                accessibilityHint={t('department.form.shortNameHint')}
                helperText={shortNameError || t('department.form.shortNameHint')}
                errorMessage={shortNameError || undefined}
                maxLength={50}
                density="compact"
                disabled={isFormDisabled}
                testID="department-form-short-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Select
                label={t('department.form.typeLabel')}
                placeholder={t('department.form.typePlaceholder')}
                options={typeOptions}
                value={departmentType}
                onValueChange={setDepartmentType}
                accessibilityLabel={t('department.form.typeLabel')}
                accessibilityHint={t('department.form.typeHint')}
                helperText={typeError || t('department.form.typeHint')}
                errorMessage={typeError || undefined}
                required
                disabled={isFormDisabled}
                testID="department-form-type"
              />
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  label={t('department.form.activeLabel')}
                  accessibilityLabel={t('department.form.activeLabel')}
                  accessibilityHint={t('department.form.activeHint')}
                  disabled={isFormDisabled}
                  testID="department-form-active"
                />
                <Text variant="caption">
                  {showCreateBlocked ? t('department.form.blockedMessage') : t('department.form.activeHint')}
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
            accessibilityLabel={t('department.form.cancel')}
            accessibilityHint={t('department.form.cancelHint')}
            testID="department-form-cancel"
            disabled={isLoading}
          >
            {t('department.form.cancel')}
          </Button>
          <Button
            variant="primary"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('department.form.submitEdit') : t('department.form.submitCreate')}
            accessibilityHint={isEdit ? t('department.form.submitEdit') : t('department.form.submitCreate')}
            testID="department-form-submit"
          >
            {isEdit ? t('department.form.submitEdit') : t('department.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default DepartmentFormScreenIOS;
