/**
 * ApiKeyPermissionFormScreen - Android
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
} from './ApiKeyPermissionFormScreen.android.styles';
import useApiKeyPermissionFormScreen from './useApiKeyPermissionFormScreen';

const ApiKeyPermissionFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    apiKeyId,
    setApiKeyId,
    permissionId,
    setPermissionId,
    apiKeyOptions,
    permissionOptions,
    apiKeyListLoading,
    apiKeyListError,
    apiKeyErrorMessage,
    permissionListLoading,
    permissionListError,
    permissionErrorMessage,
    hasApiKeys,
    hasPermissions,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    apiKeyPermission,
    onSubmit,
    onCancel,
    onGoToApiKeys,
    onGoToPermissions,
    onRetryApiKeys,
    onRetryPermissions,
    isSubmitDisabled,
  } = useApiKeyPermissionFormScreen();

  if (isEdit && !apiKeyPermission && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="api-key-permission-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !apiKeyPermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('apiKeyPermission.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('apiKeyPermission.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="api-key-permission-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && isCreateBlocked);
  const retryApiKeysAction = onRetryApiKeys ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryApiKeys}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="api-key-permission-form-api-key-retry"
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
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="api-key-permission-form-permission-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(apiKeyPermission));
  const showApiKeyBlocked = !isEdit && !hasApiKeys;
  const showPermissionBlocked = !isEdit && !hasPermissions;

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="api-key-permission-form-title">
          {isEdit ? t('apiKeyPermission.form.editTitle') : t('apiKeyPermission.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="api-key-permission-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('apiKeyPermission.form.submitErrorTitle')}
              description={errorMessage}
              testID="api-key-permission-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('apiKeyPermission.form.apiKeyLabel')} testID="api-key-permission-form-card">
          <StyledFormGrid>
            <StyledFullRow>
              <StyledFieldGroup>
                {apiKeyListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="api-key-permission-form-api-key-loading"
                  />
                ) : apiKeyListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('apiKeyPermission.form.apiKeyLoadErrorTitle')}
                    description={apiKeyErrorMessage}
                    action={retryApiKeysAction}
                    testID="api-key-permission-form-api-key-error"
                  />
                ) : !hasApiKeys ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('apiKeyPermission.form.noApiKeysMessage')}</Text>
                    <Text variant="body">{t('apiKeyPermission.form.createApiKeyFirst')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToApiKeys}
                      accessibilityLabel={t('apiKeyPermission.form.goToApiKeys')}
                      accessibilityHint={t('apiKeyPermission.form.goToApiKeysHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                      testID="api-key-permission-form-go-to-api-keys"
                    >
                      {t('apiKeyPermission.form.goToApiKeys')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('apiKeyPermission.form.apiKeyLabel')}
                    placeholder={t('apiKeyPermission.form.apiKeyPlaceholder')}
                    options={apiKeyOptions}
                    value={apiKeyId}
                    onValueChange={setApiKeyId}
                    accessibilityLabel={t('apiKeyPermission.form.apiKeyLabel')}
                    accessibilityHint={t('apiKeyPermission.form.apiKeyHint')}
                    helperText={showApiKeyBlocked ? t('apiKeyPermission.form.blockedMessage') : t('apiKeyPermission.form.apiKeyHint')}
                    required
                    disabled={isFormDisabled}
                    testID="api-key-permission-form-api-key"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFullRow>
              <StyledFieldGroup>
                {permissionListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="api-key-permission-form-permission-loading"
                  />
                ) : permissionListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('apiKeyPermission.form.permissionLoadErrorTitle')}
                    description={permissionErrorMessage}
                    action={retryPermissionsAction}
                    testID="api-key-permission-form-permission-error"
                  />
                ) : !hasPermissions ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('apiKeyPermission.form.noPermissionsMessage')}</Text>
                    <Text variant="body">{t('apiKeyPermission.form.createPermissionFirst')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToPermissions}
                      accessibilityLabel={t('apiKeyPermission.form.goToPermissions')}
                      accessibilityHint={t('apiKeyPermission.form.goToPermissionsHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                      testID="api-key-permission-form-go-to-permissions"
                    >
                      {t('apiKeyPermission.form.goToPermissions')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('apiKeyPermission.form.permissionLabel')}
                    placeholder={t('apiKeyPermission.form.permissionPlaceholder')}
                    options={permissionOptions}
                    value={permissionId}
                    onValueChange={setPermissionId}
                    accessibilityLabel={t('apiKeyPermission.form.permissionLabel')}
                    accessibilityHint={t('apiKeyPermission.form.permissionHint')}
                    helperText={showPermissionBlocked ? t('apiKeyPermission.form.blockedMessage') : t('apiKeyPermission.form.permissionHint')}
                    required
                    disabled={isFormDisabled}
                    testID="api-key-permission-form-permission"
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
            accessibilityLabel={t('apiKeyPermission.form.cancel')}
            accessibilityHint={t('apiKeyPermission.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="api-key-permission-form-cancel"
            disabled={isLoading}
          >
            {t('apiKeyPermission.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('apiKeyPermission.form.submitEdit') : t('apiKeyPermission.form.submitCreate')}
            accessibilityHint={isEdit ? t('apiKeyPermission.form.submitEdit') : t('apiKeyPermission.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="api-key-permission-form-submit"
          >
            {isEdit ? t('apiKeyPermission.form.submitEdit') : t('apiKeyPermission.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionFormScreenAndroid;
