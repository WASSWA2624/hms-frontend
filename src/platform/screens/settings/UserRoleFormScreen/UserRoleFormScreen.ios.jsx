/**
 * UserRoleFormScreen - iOS
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
} from './UserRoleFormScreen.ios.styles';
import useUserRoleFormScreen from './useUserRoleFormScreen';

const UserRoleFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    userId,
    setUserId,
    roleId,
    setRoleId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    userOptions,
    userListLoading,
    userListError,
    userErrorMessage,
    roleOptions,
    roleListLoading,
    roleListError,
    roleErrorMessage,
    hasTenants,
    hasFacilities,
    hasUsers,
    hasRoles,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    userRole,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onGoToUsers,
    onGoToRoles,
    onRetryTenants,
    onRetryFacilities,
    onRetryUsers,
    onRetryRoles,
    isSubmitDisabled,
  } = useUserRoleFormScreen();

  if (isEdit && !userRole && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-role-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !userRole) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('userRole.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('userRole.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="user-role-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading;
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="user-role-form-tenant-retry"
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
      testID="user-role-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryUsersAction = onRetryUsers ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryUsers}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="user-role-form-user-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryRolesAction = onRetryRoles ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryRoles}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="user-role-form-role-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(userRole));
  const showTenantEmpty = !tenantListLoading && !tenantListError && !hasTenants;
  const showUserEmpty = Boolean(tenantId) && !userListLoading && !userListError && !hasUsers;
  const showRoleEmpty = Boolean(tenantId) && !roleListLoading && !roleListError && !hasRoles;
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="user-role-form-title">
          {isEdit ? t('userRole.form.editTitle') : t('userRole.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="user-role-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userRole.form.submitErrorTitle')}
              description={errorMessage}
              testID="user-role-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('userRole.form.userLabel')} testID="user-role-form-card">
          <StyledFormGrid>
            <StyledFullRow>
              <StyledFieldGroup>
                {tenantListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="user-role-form-tenant-loading"
                  />
                ) : tenantListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('userRole.form.tenantLoadErrorTitle')}
                    description={tenantErrorMessage}
                    action={retryTenantsAction}
                    testID="user-role-form-tenant-error"
                  />
                ) : showTenantEmpty ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('userRole.form.noTenantsMessage')}</Text>
                    <Text variant="body">{t('userRole.form.createTenantFirst')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToTenants}
                      accessibilityLabel={t('userRole.form.goToTenants')}
                      accessibilityHint={t('userRole.form.goToTenantsHint')}
                      icon={<Icon glyph="→" size="xs" decorative />}
                      testID="user-role-form-go-to-tenants"
                    >
                      {t('userRole.form.goToTenants')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('userRole.form.tenantLabel')}
                    placeholder={t('userRole.form.tenantPlaceholder')}
                    options={tenantOptions}
                    value={tenantId}
                    onValueChange={setTenantId}
                    accessibilityLabel={t('userRole.form.tenantLabel')}
                    accessibilityHint={t('userRole.form.tenantHint')}
                    helperText={t('userRole.form.tenantHint')}
                    required
                    disabled={isFormDisabled}
                    testID="user-role-form-tenant"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFieldGroup>
              {userListLoading ? (
                <LoadingSpinner
                  accessibilityLabel={t('common.loading')}
                  testID="user-role-form-user-loading"
                />
              ) : userListError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('userRole.form.userLoadErrorTitle')}
                  description={userErrorMessage}
                  action={retryUsersAction}
                  testID="user-role-form-user-error"
                />
              ) : !tenantId ? (
                <Select
                  label={t('userRole.form.userLabel')}
                  placeholder={t('userRole.form.userPlaceholder')}
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                  accessibilityLabel={t('userRole.form.userLabel')}
                  accessibilityHint={t('userRole.form.selectTenantFirst')}
                  helperText={t('userRole.form.selectTenantFirst')}
                  disabled
                  testID="user-role-form-select-tenant-user"
                />
              ) : showUserEmpty ? (
                <StyledHelperStack>
                  <Text variant="body">{t('userRole.form.noUsersMessage')}</Text>
                  <Text variant="body">{t('userRole.form.createUserFirst')}</Text>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onGoToUsers}
                    accessibilityLabel={t('userRole.form.goToUsers')}
                    accessibilityHint={t('userRole.form.goToUsersHint')}
                    icon={<Icon glyph="→" size="xs" decorative />}
                    testID="user-role-form-go-to-users"
                  >
                    {t('userRole.form.goToUsers')}
                  </Button>
                </StyledHelperStack>
              ) : (
                <Select
                  label={t('userRole.form.userLabel')}
                  placeholder={t('userRole.form.userPlaceholder')}
                  options={userOptions}
                  value={userId}
                  onValueChange={setUserId}
                  accessibilityLabel={t('userRole.form.userLabel')}
                  accessibilityHint={t('userRole.form.userHint')}
                  helperText={t('userRole.form.userHint')}
                  required
                  disabled={isFormDisabled}
                  testID="user-role-form-user"
                />
              )}
            </StyledFieldGroup>

            <StyledFieldGroup>
              {roleListLoading ? (
                <LoadingSpinner
                  accessibilityLabel={t('common.loading')}
                  testID="user-role-form-role-loading"
                />
              ) : roleListError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('userRole.form.roleLoadErrorTitle')}
                  description={roleErrorMessage}
                  action={retryRolesAction}
                  testID="user-role-form-role-error"
                />
              ) : !tenantId ? (
                <Select
                  label={t('userRole.form.roleLabel')}
                  placeholder={t('userRole.form.rolePlaceholder')}
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                  accessibilityLabel={t('userRole.form.roleLabel')}
                  accessibilityHint={t('userRole.form.selectTenantFirst')}
                  helperText={t('userRole.form.selectTenantFirst')}
                  disabled
                  testID="user-role-form-select-tenant-role"
                />
              ) : showRoleEmpty ? (
                <StyledHelperStack>
                  <Text variant="body">{t('userRole.form.noRolesMessage')}</Text>
                  <Text variant="body">{t('userRole.form.createRoleFirst')}</Text>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onGoToRoles}
                    accessibilityLabel={t('userRole.form.goToRoles')}
                    accessibilityHint={t('userRole.form.goToRolesHint')}
                    icon={<Icon glyph="→" size="xs" decorative />}
                    testID="user-role-form-go-to-roles"
                  >
                    {t('userRole.form.goToRoles')}
                  </Button>
                </StyledHelperStack>
              ) : (
                <Select
                  label={t('userRole.form.roleLabel')}
                  placeholder={t('userRole.form.rolePlaceholder')}
                  options={roleOptions}
                  value={roleId}
                  onValueChange={setRoleId}
                  accessibilityLabel={t('userRole.form.roleLabel')}
                  accessibilityHint={t('userRole.form.roleHint')}
                  helperText={t('userRole.form.roleHint')}
                  required
                  disabled={isFormDisabled}
                  testID="user-role-form-role"
                />
              )}
            </StyledFieldGroup>

            <StyledFieldGroup>
              {facilityListLoading ? (
                <LoadingSpinner
                  accessibilityLabel={t('common.loading')}
                  testID="user-role-form-facility-loading"
                />
              ) : facilityListError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('userRole.form.facilityLoadErrorTitle')}
                  description={facilityErrorMessage}
                  action={retryFacilitiesAction}
                  testID="user-role-form-facility-error"
                />
              ) : !tenantId ? (
                <Select
                  label={t('userRole.form.facilityLabel')}
                  placeholder={t('userRole.form.facilityPlaceholder')}
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                  accessibilityLabel={t('userRole.form.facilityLabel')}
                  accessibilityHint={t('userRole.form.selectTenantFirst')}
                  helperText={t('userRole.form.selectTenantFirst')}
                  disabled
                  testID="user-role-form-select-tenant-facility"
                />
              ) : showFacilityEmpty ? (
                <StyledHelperStack>
                  <Text variant="body">{t('userRole.form.noFacilitiesMessage')}</Text>
                  <Text variant="body">{t('userRole.form.createFacilityOptional')}</Text>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onGoToFacilities}
                    accessibilityLabel={t('userRole.form.goToFacilities')}
                    accessibilityHint={t('userRole.form.goToFacilitiesHint')}
                    icon={<Icon glyph="→" size="xs" decorative />}
                    testID="user-role-form-go-to-facilities"
                  >
                    {t('userRole.form.goToFacilities')}
                  </Button>
                </StyledHelperStack>
              ) : (
                <Select
                  label={t('userRole.form.facilityLabel')}
                  placeholder={t('userRole.form.facilityPlaceholder')}
                  options={facilityOptions}
                  value={facilityId}
                  onValueChange={setFacilityId}
                  accessibilityLabel={t('userRole.form.facilityLabel')}
                  accessibilityHint={t('userRole.form.facilityHint')}
                  helperText={t('userRole.form.facilityHint')}
                  disabled={isFormDisabled}
                  testID="user-role-form-facility"
                />
              )}
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('userRole.form.cancel')}
            accessibilityHint={t('userRole.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="user-role-form-cancel"
            disabled={isLoading}
          >
            {t('userRole.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('userRole.form.submitEdit') : t('userRole.form.submitCreate')}
            accessibilityHint={isEdit ? t('userRole.form.submitEdit') : t('userRole.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
            testID="user-role-form-submit"
          >
            {isEdit ? t('userRole.form.submitEdit') : t('userRole.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserRoleFormScreenIOS;
