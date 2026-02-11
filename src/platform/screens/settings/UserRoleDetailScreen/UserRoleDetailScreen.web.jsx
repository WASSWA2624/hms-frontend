/**
 * UserRoleDetailScreen - Web
 * File: UserRoleDetailScreen.web.jsx
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
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './UserRoleDetailScreen.web.styles';
import useUserRoleDetailScreen from './useUserRoleDetailScreen';

const UserRoleDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    userRole,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUserRoleDetailScreen();

  const hasUserRole = Boolean(userRole);

  if (isLoading && !hasUserRole) {
    return (
      <StyledContainer role="main" aria-label={t('userRole.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="user-role-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasUserRole) {
    return (
      <StyledContainer role="main" aria-label={t('userRole.detail.title')}>
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
            testID="user-role-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasUserRole) {
    return (
      <StyledContainer role="main" aria-label={t('userRole.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('userRole.detail.errorTitle')}
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
            testID="user-role-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!userRole) {
    return (
      <StyledContainer role="main" aria-label={t('userRole.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('userRole.detail.notFoundTitle')}
            description={t('userRole.detail.notFoundMessage')}
            testID="user-role-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userRole.detail.backHint')}
              icon={<Icon glyph="←" size="xs" decorative />}
              testID="user-role-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(userRole.created_at, locale);
  const updatedAt = formatDateTime(userRole.updated_at, locale);
  const userId = userRole?.user_id ?? '';
  const roleId = userRole?.role_id ?? '';
  const tenantId = userRole?.tenant_id ?? '';
  const facilityId = userRole?.facility_id ?? '';
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
  const showInlineError = hasUserRole && hasError;
  const showInlineOffline = hasUserRole && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('userRole.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userRole.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="user-role-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="user-role-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('userRole.detail.title')} testID="user-role-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('userRole.detail.idLabel')}</Text>
              <Text variant="body" testID="user-role-detail-id">
                {userRole.id}
              </Text>
            </StyledDetailItem>
            {userId ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.userIdLabel')}</Text>
                <Text variant="body" testID="user-role-detail-user">
                  {userId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {roleId ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.roleIdLabel')}</Text>
                <Text variant="body" testID="user-role-detail-role">
                  {roleId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.tenantIdLabel')}</Text>
                <Text variant="body" testID="user-role-detail-tenant">
                  {tenantId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityId ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.facilityIdLabel')}</Text>
                <Text variant="body" testID="user-role-detail-facility">
                  {facilityId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.createdLabel')}</Text>
                <Text variant="body" testID="user-role-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.updatedLabel')}</Text>
                <Text variant="body" testID="user-role-detail-updated">
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
            accessibilityHint={t('userRole.detail.backHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="user-role-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('userRole.detail.edit')}
              accessibilityHint={t('userRole.detail.editHint')}
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="user-role-detail-edit"
              disabled={isLoading}
            >
              {t('userRole.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('userRole.detail.delete')}
            accessibilityHint={t('userRole.detail.deleteHint')}
            icon={<Icon glyph="✕" size="xs" decorative />}
            testID="user-role-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserRoleDetailScreenWeb;
