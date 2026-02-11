/**
 * RolePermissionFormScreen - iOS
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
} from './RolePermissionFormScreen.ios.styles';
import useRolePermissionFormScreen from './useRolePermissionFormScreen';

const RolePermissionFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    roleId,
    setRoleId,
    permissionId,
    setPermissionId,
    roleOptions,
    permissionOptions,
    roleListLoading,
    roleListError,
    roleErrorMessage,
    permissionListLoading,
    permissionListError,
    permissionErrorMessage,
    hasRoles,
    hasPermissions,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    rolePermission,
    onSubmit,
    onCancel,
    onGoToRoles,
    onGoToPermissions,
    onRetryRoles,
    onRetryPermissions,
    isSubmitDisabled,
  } = useRolePermissionFormScreen();

  if (isEdit && !rolePermission && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="role-permission-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !rolePermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('rolePermission.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('rolePermission.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="role-permission-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && isCreateBlocked);
  const retryRolesAction = onRetryRoles ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryRoles}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="role-permission-form-role-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryPermissionsAction = onRetryPermissions ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryPermissions}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="role-permission-form-permission-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(rolePermission));
  const showRoleBlocked = !isEdit && !hasRoles;
  const showPermissionBlocked = !isEdit && !hasPermissions;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="role-permission-form-title">
          {isEdit ? t('rolePermission.form.editTitle') : t('rolePermission.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="role-permission-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('rolePermission.form.submitErrorTitle')}
              description={errorMessage}
              testID="role-permission-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('rolePermission.form.roleLabel')} testID="role-permission-form-card">
          <StyledFormGrid>
            <StyledFullRow>
              <StyledFieldGroup>
                {roleListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="role-permission-form-role-loading"
                  />
                ) : roleListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('rolePermission.form.roleLoadErrorTitle')}
                    description={roleErrorMessage}
                    action={retryRolesAction}
                    testID="role-permission-form-role-error"
                  />
                ) : !hasRoles ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('rolePermission.form.noRolesMessage')}</Text>
                    <Text variant="body">{t('rolePermission.form.createRoleFirst')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToRoles}
                      accessibilityLabel={t('rolePermission.form.goToRoles')}
                      accessibilityHint={t('rolePermission.form.goToRolesHint')}
                      icon={<Icon glyph="→" size="xs" decorative />}
                      testID="role-permission-form-go-to-roles"
                    >
                      {t('rolePermission.form.goToRoles')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('rolePermission.form.roleLabel')}
                    placeholder={t('rolePermission.form.rolePlaceholder')}
                    options={roleOptions}
                    value={roleId}
                    onValueChange={setRoleId}
                    accessibilityLabel={t('rolePermission.form.roleLabel')}
                    accessibilityHint={t('rolePermission.form.roleHint')}
                    helperText={showRoleBlocked ? t('rolePermission.form.blockedMessage') : t('rolePermission.form.roleHint')}
                    required
                    disabled={isFormDisabled}
                    testID="role-permission-form-role"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFullRow>
              <StyledFieldGroup>
                {permissionListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="role-permission-form-permission-loading"
                  />
                ) : permissionListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('rolePermission.form.permissionLoadErrorTitle')}
                    description={permissionErrorMessage}
                    action={retryPermissionsAction}
                    testID="role-permission-form-permission-error"
                  />
                ) : !hasPermissions ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('rolePermission.form.noPermissionsMessage')}</Text>
                    <Text variant="body">{t('rolePermission.form.createPermissionFirst')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToPermissions}
                      accessibilityLabel={t('rolePermission.form.goToPermissions')}
                      accessibilityHint={t('rolePermission.form.goToPermissionsHint')}
                      icon={<Icon glyph="→" size="xs" decorative />}
                      testID="role-permission-form-go-to-permissions"
                    >
                      {t('rolePermission.form.goToPermissions')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('rolePermission.form.permissionLabel')}
                    placeholder={t('rolePermission.form.permissionPlaceholder')}
                    options={permissionOptions}
                    value={permissionId}
                    onValueChange={setPermissionId}
                    accessibilityLabel={t('rolePermission.form.permissionLabel')}
                    accessibilityHint={t('rolePermission.form.permissionHint')}
                    helperText={showPermissionBlocked ? t('rolePermission.form.blockedMessage') : t('rolePermission.form.permissionHint')}
                    required
                    disabled={isFormDisabled}
                    testID="role-permission-form-permission"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('rolePermission.form.cancel')}
            accessibilityHint={t('rolePermission.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="role-permission-form-cancel"
            disabled={isLoading}
          >
            {t('rolePermission.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('rolePermission.form.submitEdit') : t('rolePermission.form.submitCreate')}
            accessibilityHint={isEdit ? t('rolePermission.form.submitEdit') : t('rolePermission.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
            testID="role-permission-form-submit"
          >
            {isEdit ? t('rolePermission.form.submitEdit') : t('rolePermission.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RolePermissionFormScreenIOS;
