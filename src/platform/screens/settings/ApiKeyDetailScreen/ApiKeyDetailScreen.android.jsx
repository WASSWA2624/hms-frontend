/**
 * ApiKeyDetailScreen - Android
 * File: ApiKeyDetailScreen.android.jsx
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
import { formatDateTime, humanizeIdentifier } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './ApiKeyDetailScreen.android.styles';
import useApiKeyDetailScreen from './useApiKeyDetailScreen';

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return String(normalized).trim();
  }
  return '';
};

const resolveContextValue = (readableValue, technicalId, canViewTechnicalIds, fallbackLabel) => {
  if (readableValue) return readableValue;
  if (canViewTechnicalIds) return String(technicalId ?? '').trim();
  if (String(technicalId ?? '').trim()) return fallbackLabel;
  return '';
};

const ApiKeyDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    apiKey,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry,
    onBack,
  } = useApiKeyDetailScreen();

  const hasApiKey = Boolean(apiKey);

  if (isLoading && !hasApiKey) {
    return (
      <StyledContainer>
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
      <StyledContainer>
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
      <StyledContainer>
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

  const name = resolveContextValue(
    resolveReadableValue(apiKey?.name, apiKey?.label, apiKey?.display_name),
    apiKey?.id,
    canViewTechnicalIds,
    t('apiKey.detail.currentKey')
  );
  const userLabel = resolveContextValue(
    resolveReadableValue(
      apiKey?.user_name,
      apiKey?.user?.name,
      apiKey?.user?.full_name,
      apiKey?.user?.email,
      apiKey?.user_label
    ),
    apiKey?.user_id,
    canViewTechnicalIds,
    t('apiKey.detail.currentUser')
  );
  const tenantLabel = resolveContextValue(
    resolveReadableValue(
      apiKey?.tenant_name,
      apiKey?.tenant?.name,
      apiKey?.tenant?.slug,
      apiKey?.tenant_label
    ),
    apiKey?.tenant_id,
    canViewTechnicalIds,
    t('apiKey.detail.currentTenant')
  );
  const statusLabel = apiKey?.is_active
    ? t('apiKey.list.statusActive')
    : t('apiKey.list.statusInactive');

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

  const showInlineError = hasApiKey && hasError;
  const showInlineOffline = hasApiKey && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('apiKey.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="api-key-detail-error-banner"
            />
          ) : null}
          {showInlineOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="api-key-detail-offline-banner"
            />
          ) : null}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('apiKey.detail.title')} testID="api-key-detail-card">
          <StyledDetailGrid>
            {canViewTechnicalIds ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.idLabel')}</Text>
                <Text variant="body" testID="api-key-detail-id">
                  {apiKey.id}
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
            {userLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.userLabel')}</Text>
                <Text variant="body" testID="api-key-detail-user">
                  {userLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('apiKey.detail.tenantLabel')}</Text>
                <Text variant="body" testID="api-key-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('apiKey.detail.statusLabel')}</Text>
              <Text variant="body" testID="api-key-detail-status">
                {statusLabel}
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
            testID="api-key-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyDetailScreenAndroid;
