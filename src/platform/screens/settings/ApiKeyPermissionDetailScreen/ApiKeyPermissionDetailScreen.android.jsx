/**
 * ApiKeyPermissionDetailScreen - Android
 * File: ApiKeyPermissionDetailScreen.android.jsx
 */
import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './ApiKeyPermissionDetailScreen.android.styles';
import useApiKeyPermissionDetailScreen from './useApiKeyPermissionDetailScreen';

const ApiKeyPermissionDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    apiKeyPermission,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useApiKeyPermissionDetailScreen();

  const hasApiKeyPermission = Boolean(apiKeyPermission);

  if (isLoading && !hasApiKeyPermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="api-key-permission-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasApiKeyPermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="api-key-permission-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasApiKeyPermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('apiKeyPermission.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="api-key-permission-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!apiKeyPermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('apiKeyPermission.detail.notFoundTitle')}
            description={t('apiKeyPermission.detail.notFoundMessage')}
            testID="api-key-permission-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('apiKeyPermission.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="api-key-permission-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(apiKeyPermission.created_at, locale);
  const updatedAt = formatDateTime(apiKeyPermission.updated_at, locale);
  const apiKeyId = apiKeyPermission?.api_key_id ?? '';
  const permissionId = apiKeyPermission?.permission_id ?? '';
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasApiKeyPermission && hasError;
  const showInlineOffline = hasApiKeyPermission && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('apiKeyPermission.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="api-key-permission-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="api-key-permission-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('apiKeyPermission.detail.title')} testID="api-key-permission-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('apiKeyPermission.detail.idLabel')}</Text>
              <Text variant="body" testID="api-key-permission-detail-id">
                {apiKeyPermission.id}
              </Text>
            </StyledDetailItem>
            {apiKeyId ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.apiKeyIdLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-api-key">
                  {apiKeyId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {permissionId ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.permissionIdLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-permission">
                  {permissionId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.createdLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.updatedLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-updated">
                  {updatedAt}
                </Text>
              </StyledDetailItem>
            ) : null}
          </StyledDetailGrid>
        </Card>
        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onBack}
            accessibilityLabel={t('common.back')}
            accessibilityHint={t('apiKeyPermission.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="api-key-permission-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('apiKeyPermission.detail.edit')}
              accessibilityHint={t('apiKeyPermission.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="api-key-permission-detail-edit"
              disabled={isLoading}
            >
              {t('apiKeyPermission.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('apiKeyPermission.detail.delete')}
            accessibilityHint={t('apiKeyPermission.detail.deleteHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="api-key-permission-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionDetailScreenAndroid;
