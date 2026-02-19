/**
 * PermissionFormScreen - Web
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
} from './PermissionFormScreen.web.styles';
import usePermissionFormScreen from './usePermissionFormScreen';

const PermissionFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    name,
    setName,
    description,
    setDescription,
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
    permission,
    nameError,
    descriptionError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    tenantDisplayLabel,
    onSubmit,
    onCancel,
    onGoToTenants,
    onRetryTenants,
    isSubmitDisabled,
  } = usePermissionFormScreen();

  if (isEdit && !permission && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="permission-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !permission) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('permission.form.loadError')}
            action={(
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="permission-form-load-error"
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
      icon={<Icon glyph="â†»" size="xs" decorative />}
      testID="permission-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(permission));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const blockedMessage = showTenantBlocked
    ? t('permission.form.blockedMessage')
    : t('permission.form.nameHint');
  const nameHelperText = nameError || blockedMessage;
  const descriptionHelperText = descriptionError || (
    showTenantBlocked ? t('permission.form.blockedMessage') : t('permission.form.descriptionHint')
  );
  const tenantHelperText = tenantError || t('permission.form.tenantHint');
  const tenantLockedHint = isEdit ? t('permission.form.tenantLockedHint') : t('permission.form.tenantScopedHint');

  return (
    <StyledContainer role="main" aria-label={isEdit ? t('permission.form.editTitle') : t('permission.form.createTitle')}>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="permission-form-title">
          {isEdit ? t('permission.form.editTitle') : t('permission.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="permission-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('permission.form.submitErrorTitle')}
              description={errorMessage}
              testID="permission-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('permission.form.nameLabel')} testID="permission-form-card">
          <StyledFormGrid>
            {!isEdit && !isTenantLocked ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="permission-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('permission.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="permission-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('permission.form.tenantLabel')}
                      data-testid="permission-form-no-tenants"
                    >
                      <Text variant="body">{t('permission.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('permission.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('permission.form.goToTenants')}
                        accessibilityHint={t('permission.form.goToTenantsHint')}
                        icon={<Icon glyph="â†’" size="xs" decorative />}
                        testID="permission-form-go-to-tenants"
                      >
                        {t('permission.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('permission.form.tenantLabel')}
                      placeholder={t('permission.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('permission.form.tenantLabel')}
                      accessibilityHint={t('permission.form.tenantHint')}
                      errorMessage={tenantError}
                      helperText={tenantHelperText}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="permission-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('permission.form.tenantLabel')}
                    value={tenantDisplayLabel || lockedTenantDisplay}
                    accessibilityLabel={t('permission.form.tenantLabel')}
                    accessibilityHint={tenantLockedHint}
                    helperText={tenantLockedHint}
                    disabled
                    testID="permission-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('permission.form.nameLabel')}
                placeholder={t('permission.form.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                accessibilityLabel={t('permission.form.nameLabel')}
                accessibilityHint={t('permission.form.nameHint')}
                errorMessage={nameError}
                helperText={nameHelperText}
                required
                maxLength={120}
                density="compact"
                disabled={isFormDisabled}
                testID="permission-form-name"
              />
            </StyledFieldGroup>

            <StyledFullRow>
              <StyledFieldGroup>
                <TextArea
                  label={t('permission.form.descriptionLabel')}
                  placeholder={t('permission.form.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  accessibilityLabel={t('permission.form.descriptionLabel')}
                  accessibilityHint={t('permission.form.descriptionHint')}
                  errorMessage={descriptionError}
                  helperText={descriptionHelperText}
                  maxLength={255}
                  disabled={isFormDisabled}
                  testID="permission-form-description"
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
            accessibilityLabel={t('permission.form.cancel')}
            accessibilityHint={t('permission.form.cancelHint')}
            icon={<Icon glyph="â†" size="xs" decorative />}
            testID="permission-form-cancel"
            disabled={isLoading}
          >
            {t('permission.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('permission.form.submitEdit') : t('permission.form.submitCreate')}
            accessibilityHint={isEdit ? t('permission.form.submitEdit') : t('permission.form.submitCreate')}
            icon={<Icon glyph="âœ“" size="xs" decorative />}
            testID="permission-form-submit"
          >
            {isEdit ? t('permission.form.submitEdit') : t('permission.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default PermissionFormScreenWeb;
