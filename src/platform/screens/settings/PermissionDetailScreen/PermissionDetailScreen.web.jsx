/**
 * PermissionDetailScreen - Web
 * File: PermissionDetailScreen.web.jsx
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
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './PermissionDetailScreen.web.styles';
import usePermissionDetailScreen from './usePermissionDetailScreen';

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

const PermissionDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    permission,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = usePermissionDetailScreen();

  const hasPermission = Boolean(permission);

  if (isLoading && !hasPermission) {
    return (
      <StyledContainer role="main" aria-label={t('permission.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="permission-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasPermission) {
    return (
      <StyledContainer role="main" aria-label={t('permission.detail.title')}>
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
            testID="permission-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasPermission) {
    return (
      <StyledContainer role="main" aria-label={t('permission.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('permission.detail.errorTitle')}
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
            testID="permission-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!permission) {
    return (
      <StyledContainer role="main" aria-label={t('permission.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('permission.detail.notFoundTitle')}
            description={t('permission.detail.notFoundMessage')}
            testID="permission-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('permission.detail.backHint')}
              testID="permission-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(permission.created_at, locale);
  const updatedAt = formatDateTime(permission.updated_at, locale);
  const name = humanizeIdentifier(permission?.name) || t('permission.detail.currentPermission');
  const description = humanizeIdentifier(permission?.description);
  const tenantLabel = resolveContextValue(
    resolveReadableValue(permission?.tenant_name, permission?.tenant?.name, permission?.tenant_label),
    permission?.tenant_id,
    canViewTechnicalIds,
    t('permission.detail.currentTenant')
  );
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
  const showInlineError = hasPermission && hasError;
  const showInlineOffline = hasPermission && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('permission.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('permission.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="permission-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="permission-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('permission.detail.title')} testID="permission-detail-card">
          <StyledDetailGrid>
            {canViewTechnicalIds ? (
              <StyledDetailItem>
                <Text variant="label">{t('permission.detail.idLabel')}</Text>
                <Text variant="body" testID="permission-detail-id">
                  {permission.id}
                </Text>
              </StyledDetailItem>
            ) : null}
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('permission.detail.tenantLabel')}</Text>
                <Text variant="body" testID="permission-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {name ? (
              <StyledDetailItem>
                <Text variant="label">{t('permission.detail.nameLabel')}</Text>
                <Text variant="body" testID="permission-detail-name">
                  {name}
                </Text>
              </StyledDetailItem>
            ) : null}
            {description ? (
              <StyledDetailItem>
                <Text variant="label">{t('permission.detail.descriptionLabel')}</Text>
                <Text variant="body" testID="permission-detail-description">
                  {description}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('permission.detail.createdLabel')}</Text>
                <Text variant="body" testID="permission-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('permission.detail.updatedLabel')}</Text>
                <Text variant="body" testID="permission-detail-updated">
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
            accessibilityHint={t('permission.detail.backHint')}
            testID="permission-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('permission.detail.edit')}
              accessibilityHint={t('permission.detail.editHint')}
              testID="permission-detail-edit"
              disabled={isLoading}
            >
              {t('permission.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('permission.detail.delete')}
              accessibilityHint={t('permission.detail.deleteHint')}
              testID="permission-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default PermissionDetailScreenWeb;
