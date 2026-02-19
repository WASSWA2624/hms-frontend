/**
 * ApiKeyPermissionDetailScreen - Web
 */
import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime } from '@utils';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './ApiKeyPermissionDetailScreen.web.styles';
import useApiKeyPermissionDetailScreen from './useApiKeyPermissionDetailScreen';

const ApiKeyPermissionDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    apiKeyPermission,
    apiKeyLabel,
    permissionLabel,
    tenantLabel,
    canViewTechnicalIds,
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
      <StyledContainer role="main" aria-label={t('apiKeyPermission.detail.title')}>
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
      <StyledContainer role="main" aria-label={t('apiKeyPermission.detail.title')}>
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
      <StyledContainer role="main" aria-label={t('apiKeyPermission.detail.title')}>
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
      <StyledContainer role="main" aria-label={t('apiKeyPermission.detail.title')}>
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
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasApiKeyPermission && hasError;
  const showInlineOffline = hasApiKeyPermission && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('apiKeyPermission.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('apiKeyPermission.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="api-key-permission-detail-error-banner"
            />
          ) : null}

          {showInlineOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="api-key-permission-detail-offline-banner"
            />
          ) : null}
        </StyledInlineStates>

        <Card
          variant="outlined"
          accessibilityLabel={t('apiKeyPermission.detail.title')}
          testID="api-key-permission-detail-card"
        >
          <StyledDetailGrid>
            {canViewTechnicalIds ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.idLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-id">
                  {apiKeyPermission.id}
                </Text>
              </StyledDetailItem>
            ) : null}

            {apiKeyLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.apiKeyLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-api-key">
                  {apiKeyLabel}
                </Text>
              </StyledDetailItem>
            ) : null}

            {permissionLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.permissionLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-permission">
                  {permissionLabel}
                </Text>
              </StyledDetailItem>
            ) : null}

            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKeyPermission.detail.tenantLabel')}</Text>
                <Text variant="body" testID="api-key-permission-detail-tenant">
                  {tenantLabel}
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
            testID="api-key-permission-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>

          {onEdit ? (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('apiKeyPermission.detail.edit')}
              accessibilityHint={t('apiKeyPermission.detail.editHint')}
              testID="api-key-permission-detail-edit"
              disabled={isLoading}
            >
              {t('apiKeyPermission.detail.edit')}
            </Button>
          ) : null}

          {onDelete ? (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('apiKeyPermission.detail.delete')}
              accessibilityHint={t('apiKeyPermission.detail.deleteHint')}
              testID="api-key-permission-detail-delete"
            >
              {t('common.remove')}
            </Button>
          ) : null}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionDetailScreenWeb;
