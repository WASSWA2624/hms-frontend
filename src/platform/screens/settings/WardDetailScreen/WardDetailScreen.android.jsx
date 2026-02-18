/**
 * WardDetailScreen - Android
 * File: WardDetailScreen.android.jsx
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
} from './WardDetailScreen.android.styles';
import useWardDetailScreen from './useWardDetailScreen';

const WardDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    ward,
    wardName,
    tenantLabel,
    facilityLabel,
    wardTypeLabel,
    isActive,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useWardDetailScreen();

  const hasWard = Boolean(ward);

  if (isLoading && !hasWard) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="ward-detail-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasWard) {
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
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="ward-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasWard) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('ward.detail.errorTitle')}
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
            testID="ward-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!ward) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('ward.detail.notFoundTitle')}
            description={t('ward.detail.notFoundMessage')}
            testID="ward-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('ward.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="ward-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(ward.created_at, locale);
  const updatedAt = formatDateTime(ward.updated_at, locale);
  const name = wardName || t('common.notAvailable');
  const tenant = tenantLabel || t('common.notAvailable');
  const facility = facilityLabel || t('common.notAvailable');
  const wardType = wardTypeLabel || t('common.notAvailable');
  const activeLabel = isActive === null ? t('common.notAvailable') : (isActive ? t('common.on') : t('common.off'));
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
  const showInlineError = hasWard && hasError;
  const showInlineOffline = hasWard && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('ward.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="ward-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="ward-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('ward.detail.title')} testID="ward-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('ward.detail.nameLabel')}</Text>
              <Text variant="body" testID="ward-detail-name">
                {name}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('ward.detail.tenantLabel')}</Text>
              <Text variant="body" testID="ward-detail-tenant">
                {tenant}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('ward.detail.facilityLabel')}</Text>
              <Text variant="body" testID="ward-detail-facility">
                {facility}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('ward.detail.typeLabel')}</Text>
              <Text variant="body" testID="ward-detail-type">
                {wardType}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('ward.detail.activeLabel')}</Text>
              <Text variant="body" testID="ward-detail-active">
                {activeLabel}
              </Text>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('ward.detail.createdLabel')}</Text>
                <Text variant="body" testID="ward-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('ward.detail.updatedLabel')}</Text>
                <Text variant="body" testID="ward-detail-updated">
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
            accessibilityHint={t('ward.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="ward-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('ward.detail.edit')}
              accessibilityHint={t('ward.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="ward-detail-edit"
              disabled={isLoading}
            >
              {t('ward.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('ward.detail.delete')}
              accessibilityHint={t('ward.detail.deleteHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="ward-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default WardDetailScreenAndroid;

