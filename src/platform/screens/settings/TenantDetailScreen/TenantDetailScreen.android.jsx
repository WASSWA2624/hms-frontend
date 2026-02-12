/**
 * TenantDetailScreen - Android
 * File: TenantDetailScreen.android.jsx
 */
import React from 'react';
import {
  Badge,
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
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './TenantDetailScreen.android.styles';
import useTenantDetailScreen from './useTenantDetailScreen';

const TenantDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    tenant,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
    onAssignTenantAdmin,
  } = useTenantDetailScreen();

  const hasTenant = Boolean(tenant);

  if (isLoading && !hasTenant) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="tenant-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasTenant) {
    return (
      <StyledContainer>
        <StyledContent>
          <OfflineState
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={
              <Button
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
              >
                {t('common.retry')}
              </Button>
            }
            testID="tenant-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasTenant) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('tenant.detail.errorTitle')}
            description={errorMessage}
            action={
              <Button
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
              >
                {t('common.retry')}
              </Button>
            }
            testID="tenant-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!tenant) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('tenant.detail.notFoundTitle')}
            description={t('tenant.detail.notFoundMessage')}
            testID="tenant-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="primary"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('tenant.detail.backHint')}
              testID="tenant-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(tenant.created_at, locale);
  const updatedAt = formatDateTime(tenant.updated_at, locale);
  const name = tenant?.name ?? '';
  const slug = tenant?.slug ?? '';
  const isActive = tenant?.is_active ?? false;
  const statusLabel = isActive ? t('common.on') : t('common.off');
  const statusVariant = isActive ? 'success' : 'warning';
  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasTenant && hasError;
  const showInlineOffline = hasTenant && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('tenant.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="tenant-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="tenant-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card
          variant="outlined"
          accessibilityLabel={t('tenant.detail.title')}
          testID="tenant-detail-card"
        >
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('tenant.detail.idLabel')}</Text>
              <Text variant="body" testID="tenant-detail-id">
                {tenant.id}
              </Text>
            </StyledDetailItem>
            {name ? (
              <StyledDetailItem>
                <Text variant="label">{t('tenant.detail.nameLabel')}</Text>
                <Text variant="body" testID="tenant-detail-name">
                  {name}
                </Text>
              </StyledDetailItem>
            ) : null}
            {slug ? (
              <StyledDetailItem>
                <Text variant="label">{t('tenant.detail.slugLabel')}</Text>
                <Text variant="body" testID="tenant-detail-slug">
                  {slug}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('tenant.detail.activeLabel')}</Text>
              <Badge
                variant={statusVariant}
                size="small"
                accessibilityLabel={t('tenant.detail.activeLabel')}
                testID="tenant-detail-active"
              >
                {statusLabel}
              </Badge>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('tenant.detail.createdLabel')}</Text>
                <Text variant="body" testID="tenant-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('tenant.detail.updatedLabel')}</Text>
                <Text variant="body" testID="tenant-detail-updated">
                  {updatedAt}
                </Text>
              </StyledDetailItem>
            ) : null}
          </StyledDetailGrid>
        </Card>
        <StyledActions>
          <Button
            variant="ghost"
            size="small"
            onPress={onBack}
            accessibilityLabel={t('common.back')}
            accessibilityHint={t('tenant.detail.backHint')}
            testID="tenant-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="secondary"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('tenant.detail.edit')}
              accessibilityHint={t('tenant.detail.editHint')}
              testID="tenant-detail-edit"
              disabled={isLoading}
            >
              {t('tenant.detail.edit')}
            </Button>
          )}
          {onAssignTenantAdmin && (
            <Button
              variant="secondary"
              size="small"
              onPress={onAssignTenantAdmin}
              accessibilityLabel={t('tenant.detail.assignAdmin')}
              accessibilityHint={t('tenant.detail.assignAdminHint')}
              testID="tenant-detail-assign-admin"
              disabled={isLoading}
            >
              {t('tenant.detail.assignAdmin')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="primary"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('tenant.detail.delete')}
              accessibilityHint={t('tenant.detail.deleteHint')}
              testID="tenant-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default TenantDetailScreenAndroid;
