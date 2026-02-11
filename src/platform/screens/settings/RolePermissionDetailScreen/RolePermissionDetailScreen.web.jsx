/**
 * RolePermissionDetailScreen - Web
 * File: RolePermissionDetailScreen.web.jsx
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
} from './RolePermissionDetailScreen.web.styles';
import useRolePermissionDetailScreen from './useRolePermissionDetailScreen';

const RolePermissionDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    rolePermission,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useRolePermissionDetailScreen();

  const hasRolePermission = Boolean(rolePermission);

  if (isLoading && !hasRolePermission) {
    return (
      <StyledContainer role="main" aria-label={t('rolePermission.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="role-permission-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasRolePermission) {
    return (
      <StyledContainer role="main" aria-label={t('rolePermission.detail.title')}>
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
                icon={<Icon glyph="↻" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="role-permission-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasRolePermission) {
    return (
      <StyledContainer role="main" aria-label={t('rolePermission.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('rolePermission.detail.errorTitle')}
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
            testID="role-permission-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!rolePermission) {
    return (
      <StyledContainer role="main" aria-label={t('rolePermission.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('rolePermission.detail.notFoundTitle')}
            description={t('rolePermission.detail.notFoundMessage')}
            testID="role-permission-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('rolePermission.detail.backHint')}
              icon={<Icon glyph="←" size="xs" decorative />}
              testID="role-permission-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(rolePermission.created_at, locale);
  const updatedAt = formatDateTime(rolePermission.updated_at, locale);
  const roleId = rolePermission?.role_id ?? '';
  const permissionId = rolePermission?.permission_id ?? '';
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
  const showInlineError = hasRolePermission && hasError;
  const showInlineOffline = hasRolePermission && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('rolePermission.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('rolePermission.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="role-permission-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="role-permission-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('rolePermission.detail.title')} testID="role-permission-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('rolePermission.detail.idLabel')}</Text>
              <Text variant="body" testID="role-permission-detail-id">
                {rolePermission.id}
              </Text>
            </StyledDetailItem>
            {roleId ? (
              <StyledDetailItem>
                <Text variant="label">{t('rolePermission.detail.roleIdLabel')}</Text>
                <Text variant="body" testID="role-permission-detail-role">
                  {roleId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {permissionId ? (
              <StyledDetailItem>
                <Text variant="label">{t('rolePermission.detail.permissionIdLabel')}</Text>
                <Text variant="body" testID="role-permission-detail-permission">
                  {permissionId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('rolePermission.detail.createdLabel')}</Text>
                <Text variant="body" testID="role-permission-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('rolePermission.detail.updatedLabel')}</Text>
                <Text variant="body" testID="role-permission-detail-updated">
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
            accessibilityHint={t('rolePermission.detail.backHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="role-permission-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('rolePermission.detail.edit')}
              accessibilityHint={t('rolePermission.detail.editHint')}
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="role-permission-detail-edit"
              disabled={isLoading}
            >
              {t('rolePermission.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('rolePermission.detail.delete')}
            accessibilityHint={t('rolePermission.detail.deleteHint')}
            icon={<Icon glyph="✕" size="xs" decorative />}
            testID="role-permission-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RolePermissionDetailScreenWeb;
