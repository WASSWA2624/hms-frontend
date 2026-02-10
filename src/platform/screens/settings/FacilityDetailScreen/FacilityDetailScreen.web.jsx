/**
 * FacilityDetailScreen - Web
 * File: FacilityDetailScreen.web.jsx
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
} from './FacilityDetailScreen.web.styles';
import useFacilityDetailScreen from './useFacilityDetailScreen';

const resolveFacilityTypeLabel = (t, value) => {
  if (!value) return '';
  const key = `facility.form.type${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const FacilityDetailScreenWeb = () => {
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
      <StyledContainer role="main" aria-label={t('facility.detail.title')}>
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
      <StyledContainer role="main" aria-label={t('facility.detail.title')}>
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
      <StyledContainer role="main" aria-label={t('facility.detail.title')}>
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
      <StyledContainer role="main" aria-label={t('facility.detail.title')}>
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
  const name = facility?.name ?? '';
  const tenantId = facility?.tenant_id ?? '';
  const facilityType = resolveFacilityTypeLabel(t, facility?.facility_type);
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
    <StyledContainer role="main" aria-label={t('facility.detail.title')}>
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
              <Text variant="label">{t('facility.detail.idLabel')}</Text>
              <Text variant="body" testID="facility-detail-id">
                {facility.id}
              </Text>
            </StyledDetailItem>
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('facility.detail.tenantLabel')}</Text>
                <Text variant="body" testID="facility-detail-tenant">
                  {tenantId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {name ? (
              <StyledDetailItem>
                <Text variant="label">{t('facility.detail.nameLabel')}</Text>
                <Text variant="body" testID="facility-detail-name">
                  {name}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityType ? (
              <StyledDetailItem>
                <Text variant="label">{t('facility.detail.typeLabel')}</Text>
                <Text variant="body" testID="facility-detail-type">
                  {facilityType}
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
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default FacilityDetailScreenWeb;
