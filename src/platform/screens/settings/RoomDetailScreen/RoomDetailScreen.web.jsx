/**
 * RoomDetailScreen - Web
 * File: RoomDetailScreen.web.jsx
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
} from './RoomDetailScreen.web.styles';
import useRoomDetailScreen from './useRoomDetailScreen';

const RoomDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    room,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useRoomDetailScreen();

  const hasRoom = Boolean(room);

  if (isLoading && !hasRoom) {
    return (
      <StyledContainer role="main" aria-label={t('room.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="room-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasRoom) {
    return (
      <StyledContainer role="main" aria-label={t('room.detail.title')}>
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
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="room-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasRoom) {
    return (
      <StyledContainer role="main" aria-label={t('room.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('room.detail.errorTitle')}
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
            testID="room-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!room) {
    return (
      <StyledContainer role="main" aria-label={t('room.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('room.detail.notFoundTitle')}
            description={t('room.detail.notFoundMessage')}
            testID="room-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('room.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="room-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(room.created_at, locale);
  const updatedAt = formatDateTime(room.updated_at, locale);
  const name = room?.name ?? '';
  const floor = room?.floor ?? '';
  const tenantId = room?.tenant_id ?? '';
  const facilityId = room?.facility_id ?? '';
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
  const showInlineError = hasRoom && hasError;
  const showInlineOffline = hasRoom && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('room.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('room.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="room-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="room-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('room.detail.title')} testID="room-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('room.detail.idLabel')}</Text>
              <Text variant="body" testID="room-detail-id">
                {room.id}
              </Text>
            </StyledDetailItem>
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('room.detail.tenantLabel')}</Text>
                <Text variant="body" testID="room-detail-tenant">
                  {tenantId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityId ? (
              <StyledDetailItem>
                <Text variant="label">{t('room.detail.facilityLabel')}</Text>
                <Text variant="body" testID="room-detail-facility">
                  {facilityId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {name ? (
              <StyledDetailItem>
                <Text variant="label">{t('room.detail.nameLabel')}</Text>
                <Text variant="body" testID="room-detail-name">
                  {name}
                </Text>
              </StyledDetailItem>
            ) : null}
            {floor ? (
              <StyledDetailItem>
                <Text variant="label">{t('room.detail.floorLabel')}</Text>
                <Text variant="body" testID="room-detail-floor">
                  {floor}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('room.detail.createdLabel')}</Text>
                <Text variant="body" testID="room-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('room.detail.updatedLabel')}</Text>
                <Text variant="body" testID="room-detail-updated">
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
            accessibilityHint={t('room.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="room-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('room.detail.edit')}
              accessibilityHint={t('room.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="room-detail-edit"
              disabled={isLoading}
            >
              {t('room.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('room.detail.delete')}
            accessibilityHint={t('room.detail.deleteHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="room-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoomDetailScreenWeb;
