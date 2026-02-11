/**
 * ApiKeyDetailScreen - Web
 * File: ApiKeyDetailScreen.web.jsx
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
} from './ApiKeyDetailScreen.web.styles';
import useApiKeyDetailScreen from './useApiKeyDetailScreen';

const ApiKeyDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    apiKey,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useApiKeyDetailScreen();

  const hasApiKey = Boolean(apiKey);

  if (isLoading && !hasApiKey) {
    return (
      <StyledContainer role="main" aria-label={t('apiKey.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="api-key-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasApiKey) {
    return (
      <StyledContainer role="main" aria-label={t('apiKey.detail.title')}>
        <StyledContent>
          <OfflineState
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="↻" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="api-key-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasApiKey) {
    return (
      <StyledContainer role="main" aria-label={t('apiKey.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('apiKey.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="↻" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="api-key-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!apiKey) {
    return (
      <StyledContainer role="main" aria-label={t('apiKey.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('apiKey.detail.notFoundTitle')}
            description={t('apiKey.detail.notFoundMessage')}
            testID="api-key-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('apiKey.detail.backHint')}
              icon={<Icon glyph="←" size="xs" decorative />}
              testID="api-key-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(apiKey.created_at, locale);
  const updatedAt = formatDateTime(apiKey.updated_at, locale);
  const lastUsedAt = formatDateTime(apiKey.last_used_at, locale);
  const expiresAt = formatDateTime(apiKey.expires_at, locale);
  const tenantId = apiKey?.tenant_id ?? '';
  const userId = apiKey?.user_id ?? '';
  const name = apiKey?.name ?? '';
  const isActive = apiKey?.is_active ?? false;
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasApiKey && hasError;
  const showInlineOffline = hasApiKey && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('apiKey.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('apiKey.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="api-key-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="api-key-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('apiKey.detail.title')} testID="api-key-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('apiKey.detail.idLabel')}</Text>
              <Text variant="body" testID="api-key-detail-id">
                {apiKey.id}
              </Text>
            </StyledDetailItem>
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.tenantIdLabel')}</Text>
                <Text variant="body" testID="api-key-detail-tenant">
                  {tenantId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {userId ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.userIdLabel')}</Text>
                <Text variant="body" testID="api-key-detail-user">
                  {userId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {name ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.nameLabel')}</Text>
                <Text variant="body" testID="api-key-detail-name">
                  {name}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('apiKey.detail.activeLabel')}</Text>
              <Text variant="body" testID="api-key-detail-active">
                {isActive ? t('common.on') : t('common.off')}
              </Text>
            </StyledDetailItem>
            {lastUsedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.lastUsedLabel')}</Text>
                <Text variant="body" testID="api-key-detail-last-used">
                  {lastUsedAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {expiresAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.expiresLabel')}</Text>
                <Text variant="body" testID="api-key-detail-expires">
                  {expiresAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.createdLabel')}</Text>
                <Text variant="body" testID="api-key-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.updatedLabel')}</Text>
                <Text variant="body" testID="api-key-detail-updated">
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
            accessibilityHint={t('apiKey.detail.backHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="api-key-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('apiKey.detail.edit')}
              accessibilityHint={t('apiKey.detail.editHint')}
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="api-key-detail-edit"
              disabled={isLoading}
            >
              {t('apiKey.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('apiKey.detail.delete')}
            accessibilityHint={t('apiKey.detail.deleteHint')}
            icon={<Icon glyph="×" size="xs" decorative />}
            testID="api-key-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyDetailScreenWeb;
