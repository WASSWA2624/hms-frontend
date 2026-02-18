/**
 * BedDetailScreen - iOS
 * File: BedDetailScreen.ios.jsx
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
} from './BedDetailScreen.ios.styles';
import useBedDetailScreen from './useBedDetailScreen';

const resolveBedStatusLabel = (t, statusValue) => {
  const normalizedStatus = String(statusValue ?? '').trim();
  if (!normalizedStatus) return t('common.notAvailable');
  const key = `bed.form.statusOptions.${normalizedStatus}`;
  const resolved = t(key);
  return resolved === key ? normalizedStatus : resolved;
};

const BedDetailScreenIOS = () => {
  const { t, locale } = useI18n();
  const {
    bed,
    bedLabel,
    tenantLabel,
    facilityLabel,
    wardLabel,
    roomLabel,
    statusValue,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useBedDetailScreen();

  const hasBed = Boolean(bed);

  if (isLoading && !hasBed) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="bed-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasBed) {
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
            testID="bed-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasBed) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('bed.detail.errorTitle')}
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
            testID="bed-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!bed) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('bed.detail.notFoundTitle')}
            description={t('bed.detail.notFoundMessage')}
            testID="bed-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('bed.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="bed-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(bed.created_at, locale);
  const updatedAt = formatDateTime(bed.updated_at, locale);
  const label = bedLabel || t('bed.detail.labelFallback');
  const status = resolveBedStatusLabel(t, statusValue);
  const tenant = tenantLabel || t('common.notAvailable');
  const facility = facilityLabel || t('common.notAvailable');
  const ward = wardLabel || t('common.notAvailable');
  const room = roomLabel || t('common.notAvailable');
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
  const showInlineError = hasBed && hasError;
  const showInlineOffline = hasBed && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('bed.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="bed-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="bed-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('bed.detail.title')} testID="bed-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('bed.detail.labelLabel')}</Text>
              <Text variant="body" testID="bed-detail-label">
                {label}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('bed.detail.tenantLabel')}</Text>
              <Text variant="body" testID="bed-detail-tenant">
                {tenant}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('bed.detail.facilityLabel')}</Text>
              <Text variant="body" testID="bed-detail-facility">
                {facility}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('bed.detail.wardLabel')}</Text>
              <Text variant="body" testID="bed-detail-ward">
                {ward}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('bed.detail.roomLabel')}</Text>
              <Text variant="body" testID="bed-detail-room">
                {room}
              </Text>
            </StyledDetailItem>
            <StyledDetailItem>
              <Text variant="label">{t('bed.detail.statusLabel')}</Text>
              <Text variant="body" testID="bed-detail-status">
                {status}
              </Text>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('bed.detail.createdLabel')}</Text>
                <Text variant="body" testID="bed-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('bed.detail.updatedLabel')}</Text>
                <Text variant="body" testID="bed-detail-updated">
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
            accessibilityHint={t('bed.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="bed-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('bed.detail.edit')}
              accessibilityHint={t('bed.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="bed-detail-edit"
              disabled={isLoading}
            >
              {t('bed.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('bed.detail.delete')}
              accessibilityHint={t('bed.detail.deleteHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="bed-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default BedDetailScreenIOS;

