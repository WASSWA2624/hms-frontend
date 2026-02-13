/**
 * UserDetailScreen - Android
 * File: UserDetailScreen.android.jsx
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
} from './UserDetailScreen.android.styles';
import useUserDetailScreen from './useUserDetailScreen';

const resolveStatusLabel = (t, value) => {
  if (!value) return '';
  const key = `user.status.${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const UserDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    user,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUserDetailScreen();

  const hasUser = Boolean(user);

  if (isLoading && !hasUser) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="user-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasUser) {
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
            testID="user-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasUser) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('user.detail.errorTitle')}
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
            testID="user-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!user) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('user.detail.notFoundTitle')}
            description={t('user.detail.notFoundMessage')}
            testID="user-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('user.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="user-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(user.created_at, locale);
  const updatedAt = formatDateTime(user.updated_at, locale);
  const email = user?.email ?? '';
  const phone = user?.phone ?? '';
  const status = user?.status ?? '';
  const statusLabel = resolveStatusLabel(t, status);
  const tenantId = user?.tenant_id ?? '';
  const facilityId = user?.facility_id ?? '';
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
  const showInlineError = hasUser && hasError;
  const showInlineOffline = hasUser && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('user.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="user-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="user-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('user.detail.title')} testID="user-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('user.detail.idLabel')}</Text>
              <Text variant="body" testID="user-detail-id">
                {user.id}
              </Text>
            </StyledDetailItem>
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('user.detail.tenantLabel')}</Text>
                <Text variant="body" testID="user-detail-tenant">
                  {tenantId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityId ? (
              <StyledDetailItem>
                <Text variant="label">{t('user.detail.facilityLabel')}</Text>
                <Text variant="body" testID="user-detail-facility">
                  {facilityId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {email ? (
              <StyledDetailItem>
                <Text variant="label">{t('user.detail.emailLabel')}</Text>
                <Text variant="body" testID="user-detail-email">
                  {email}
                </Text>
              </StyledDetailItem>
            ) : null}
            {phone ? (
              <StyledDetailItem>
                <Text variant="label">{t('user.detail.phoneLabel')}</Text>
                <Text variant="body" testID="user-detail-phone">
                  {phone}
                </Text>
              </StyledDetailItem>
            ) : null}
            {status ? (
              <StyledDetailItem>
                <Text variant="label">{t('user.detail.statusLabel')}</Text>
                <Text variant="body" testID="user-detail-status">
                  {statusLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('user.detail.createdLabel')}</Text>
                <Text variant="body" testID="user-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('user.detail.updatedLabel')}</Text>
                <Text variant="body" testID="user-detail-updated">
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
            accessibilityHint={t('user.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="user-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('user.detail.edit')}
              accessibilityHint={t('user.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="user-detail-edit"
              disabled={isLoading}
            >
              {t('user.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('user.detail.delete')}
              accessibilityHint={t('user.detail.deleteHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="user-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserDetailScreenAndroid;
