/**
 * PermissionDetailScreen - Android
 * File: PermissionDetailScreen.android.jsx
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
} from './PermissionDetailScreen.android.styles';
import usePermissionDetailScreen from './usePermissionDetailScreen';

const PermissionDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    permission,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = usePermissionDetailScreen();

  const hasPermission = Boolean(permission);

  if (isLoading && !hasPermission) {
    return (
      <StyledContainer>
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
      <StyledContainer>
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
            testID="permission-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasPermission) {
    return (
      <StyledContainer>
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
                icon={<Icon glyph="↻" size="xs" decorative />}
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
      <StyledContainer>
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
              icon={<Icon glyph="←" size="xs" decorative />}
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
  const tenantId = permission?.tenant_id ?? '';
  const name = permission?.name ?? '';
  const description = permission?.description ?? '';
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
  const showInlineError = hasPermission && hasError;
  const showInlineOffline = hasPermission && isOffline;

  return (
    <StyledContainer>
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
            <StyledDetailItem>
              <Text variant="label">{t('permission.detail.idLabel')}</Text>
              <Text variant="body" testID="permission-detail-id">
                {permission.id}
              </Text>
            </StyledDetailItem>
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('permission.detail.tenantLabel')}</Text>
                <Text variant="body" testID="permission-detail-tenant">
                  {tenantId}
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
            icon={<Icon glyph="←" size="xs" decorative />}
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
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="permission-detail-edit"
              disabled={isLoading}
            >
              {t('permission.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('permission.detail.delete')}
            accessibilityHint={t('permission.detail.deleteHint')}
            icon={<Icon glyph="✕" size="xs" decorative />}
            testID="permission-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default PermissionDetailScreenAndroid;
