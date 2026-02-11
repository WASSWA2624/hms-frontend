/**
 * ApiKeyFormScreen - Android
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
} from './ApiKeyFormScreen.android.styles';
import useApiKeyFormScreen from './useApiKeyFormScreen';

const ApiKeyFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    userId,
    setUserId,
    name,
    setName,
    isActive,
    setIsActive,
    expiresAt,
    setExpiresAt,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    userOptions,
    userListLoading,
    userListError,
    userErrorMessage,
    hasTenants,
    hasUsers,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    apiKey,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToUsers,
    onRetryTenants,
    onRetryUsers,
    isSubmitDisabled,
  } = useApiKeyFormScreen();

  if (isEdit && !apiKey && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="api-key-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !apiKey) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('apiKey.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('apiKey.form.cancelHint')}
                icon={<Icon glyph="←" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="api-key-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="api-key-form-tenant-retry"
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
      testID="api-key-form-user-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(apiKey));
  const showTenantBlocked = !isEdit && !hasTenants;
  const showUserBlocked = !isEdit && Boolean(tenantId) && !userListLoading && !userListError && !hasUsers;
  const showCreateBlocked = showTenantBlocked || showUserBlocked || isCreateBlocked;
  const blockedMessage = showTenantBlocked ? t('apiKey.form.blockedMessage') : t('apiKey.form.userBlockedMessage');

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="api-key-form-title">
          {isEdit ? t('apiKey.form.editTitle') : t('apiKey.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="api-key-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('apiKey.form.submitErrorTitle')}
              description={errorMessage}
              testID="api-key-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('apiKey.form.nameLabel')} testID="api-key-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="api-key-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('apiKey.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="api-key-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack accessibilityLabel={t('apiKey.form.tenantLabel')} testID="api-key-form-no-tenants">
                      <Text variant="body">{t('apiKey.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('apiKey.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('apiKey.form.goToTenants')}
                        accessibilityHint={t('apiKey.form.goToTenantsHint')}
                        icon={<Icon glyph="→" size="xs" decorative />}
                        testID="api-key-form-go-to-tenants"
                      >
                        {t('apiKey.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('apiKey.form.tenantLabel')}
                      placeholder={t('apiKey.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('apiKey.form.tenantLabel')}
                      accessibilityHint={t('apiKey.form.tenantHint')}
                      helperText={t('apiKey.form.tenantHint')}
                      required
                      compact
                      disabled={isLoading}
                      testID="api-key-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('apiKey.form.tenantLabel')}
                    value={tenantId}
                    accessibilityLabel={t('apiKey.form.tenantLabel')}
                    accessibilityHint={t('apiKey.form.tenantLockedHint')}
                    helperText={t('apiKey.form.tenantLockedHint')}
                    disabled
                    testID="api-key-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {userListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="api-key-form-user-loading"
                    />
                  ) : userListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('apiKey.form.userLoadErrorTitle')}
                      description={userErrorMessage}
                      action={retryUsersAction}
                      testID="api-key-form-user-error"
                    />
                  ) : !tenantId ? (
                    <Select
                      label={t('apiKey.form.userLabel')}
                      placeholder={t('apiKey.form.userPlaceholder')}
                      options={[]}
                      value=""
                      onValueChange={() => {}}
                      accessibilityLabel={t('apiKey.form.userLabel')}
                      accessibilityHint={t('apiKey.form.selectTenantFirst')}
                      helperText={t('apiKey.form.selectTenantFirst')}
                      compact
                      disabled
                      testID="api-key-form-select-tenant"
                    />
                  ) : !hasUsers ? (
                    <StyledHelperStack accessibilityLabel={t('apiKey.form.userLabel')} testID="api-key-form-no-users">
                      <Text variant="body">{t('apiKey.form.noUsersMessage')}</Text>
                      <Text variant="body">{t('apiKey.form.createUserFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToUsers}
                        accessibilityLabel={t('apiKey.form.goToUsers')}
                        accessibilityHint={t('apiKey.form.goToUsersHint')}
                        icon={<Icon glyph="→" size="xs" decorative />}
                        testID="api-key-form-go-to-users"
                      >
                        {t('apiKey.form.goToUsers')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('apiKey.form.userLabel')}
                      placeholder={t('apiKey.form.userPlaceholder')}
                      options={userOptions}
                      value={userId}
                      onValueChange={setUserId}
                      accessibilityLabel={t('apiKey.form.userLabel')}
                      accessibilityHint={t('apiKey.form.userHint')}
                      helperText={t('apiKey.form.userHint')}
                      required
                      compact
                      disabled={isLoading}
                      testID="api-key-form-user"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('apiKey.form.userLabel')}
                    value={userId}
                    accessibilityLabel={t('apiKey.form.userLabel')}
                    accessibilityHint={t('apiKey.form.userLockedHint')}
                    helperText={t('apiKey.form.userLockedHint')}
                    disabled
                    testID="api-key-form-user-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('apiKey.form.nameLabel')}
                placeholder={t('apiKey.form.namePlaceholder')}
                value={name}
                onChangeText={setName}
                accessibilityLabel={t('apiKey.form.nameLabel')}
                accessibilityHint={t('apiKey.form.nameHint')}
                helperText={showCreateBlocked ? blockedMessage : t('apiKey.form.nameHint')}
                required
                disabled={isLoading || showCreateBlocked}
                testID="api-key-form-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('apiKey.form.expiresAtLabel')}
                placeholder={t('apiKey.form.expiresAtPlaceholder')}
                value={expiresAt}
                onChangeText={setExpiresAt}
                accessibilityLabel={t('apiKey.form.expiresAtLabel')}
                accessibilityHint={t('apiKey.form.expiresAtHint')}
                helperText={t('apiKey.form.expiresAtHint')}
                disabled={isLoading || showCreateBlocked}
                testID="api-key-form-expires-at"
              />
            </StyledFieldGroup>

            {isEdit && (
              <StyledFullRow>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  label={t('apiKey.form.activeLabel')}
                  accessibilityLabel={t('apiKey.form.activeLabel')}
                  accessibilityHint={t('apiKey.form.activeHint')}
                  testID="api-key-form-active"
                />
              </StyledFullRow>
            )}
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('apiKey.form.cancel')}
            accessibilityHint={t('apiKey.form.cancelHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="api-key-form-cancel"
            disabled={isLoading}
          >
            {t('apiKey.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('apiKey.form.submitEdit') : t('apiKey.form.submitCreate')}
            accessibilityHint={isEdit ? t('apiKey.form.submitEdit') : t('apiKey.form.submitCreate')}
            icon={<Icon glyph="✓" size="xs" decorative />}
            testID="api-key-form-submit"
          >
            {isEdit ? t('apiKey.form.submitEdit') : t('apiKey.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyFormScreenAndroid;
