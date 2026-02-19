/**
 * FacilityDetailScreen - Android
 * File: FacilityDetailScreen.android.jsx
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
import { formatDateTime, humanizeIdentifier } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './FacilityDetailScreen.android.styles';
import useFacilityDetailScreen from './useFacilityDetailScreen';

const FacilityDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    facility,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useFacilityDetailScreen();

  const hasFacility = Boolean(facility);

  if (isLoading && !hasFacility) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="facility-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasFacility) {
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
            testID="facility-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasFacility) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('facility.detail.errorTitle')}
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
            testID="facility-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!facility) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('facility.detail.notFoundTitle')}
            description={t('facility.detail.notFoundMessage')}
            testID="facility-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="primary"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('facility.detail.backHint')}
              testID="facility-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(facility.created_at, locale);
  const updatedAt = formatDateTime(facility.updated_at, locale);
  const displayName = humanizeIdentifier(facility?.name) || t('facility.detail.nameFallback');
  const facilityTypeValue = String(facility?.facility_type ?? '').trim();
  const facilityTypeLabel = (() => {
    if (!facilityTypeValue) return '';
    const key = `facility.form.type${facilityTypeValue}`;
    const resolved = t(key);
    return resolved === key ? facilityTypeValue : resolved;
  })();
  const tenantLabel = humanizeIdentifier(
    facility?.tenant_name
    ?? facility?.tenant?.name
    ?? facility?.tenant_label
  ) || (facility?.tenant_id ? t('common.notAvailable') : '');
  const isActive = facility?.is_active ?? false;
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
  const showInlineError = hasFacility && hasError;
  const showInlineOffline = hasFacility && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('facility.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="facility-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="facility-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card
          variant="outlined"
          accessibilityLabel={t('facility.detail.title')}
          testID="facility-detail-card"
        >
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('facility.detail.nameLabel')}</Text>
              <Text variant="body" testID="facility-detail-name">
                {displayName}
              </Text>
            </StyledDetailItem>
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('facility.detail.tenantLabel')}</Text>
                <Text variant="body" testID="facility-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityTypeLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('facility.detail.typeLabel')}</Text>
                <Text variant="body" testID="facility-detail-type">
                  {facilityTypeLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('facility.detail.activeLabel')}</Text>
              <Badge
                variant={statusVariant}
                size="small"
                accessibilityLabel={t('facility.detail.activeLabel')}
                testID="facility-detail-active"
              >
                {statusLabel}
              </Badge>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('facility.detail.createdLabel')}</Text>
                <Text variant="body" testID="facility-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('facility.detail.updatedLabel')}</Text>
                <Text variant="body" testID="facility-detail-updated">
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
            accessibilityHint={t('facility.detail.backHint')}
            testID="facility-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="secondary"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('facility.detail.edit')}
              accessibilityHint={t('facility.detail.editHint')}
              testID="facility-detail-edit"
              disabled={isLoading}
            >
              {t('facility.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="primary"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('facility.detail.delete')}
              accessibilityHint={t('facility.detail.deleteHint')}
              testID="facility-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default FacilityDetailScreenAndroid;

