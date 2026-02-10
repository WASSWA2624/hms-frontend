/**
 * UnitDetailScreen - Android
 * File: UnitDetailScreen.android.jsx
 */
import React from 'react';
import {
  Badge,
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
} from './UnitDetailScreen.android.styles';
import useUnitDetailScreen from './useUnitDetailScreen';

const UnitDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    unit,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUnitDetailScreen();

  const hasUnit = Boolean(unit);

  if (isLoading && !hasUnit) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="unit-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasUnit) {
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
            testID="unit-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasUnit) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('unit.detail.errorTitle')}
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
            testID="unit-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!unit) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('unit.detail.notFoundTitle')}
            description={t('unit.detail.notFoundMessage')}
            testID="unit-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('unit.detail.backHint')}
              icon={<Icon glyph="←" size="xs" decorative />}
              testID="unit-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(unit.created_at, locale);
  const updatedAt = formatDateTime(unit.updated_at, locale);
  const name = unit?.name ?? '';
  const tenantId = unit?.tenant_id ?? '';
  const isActive = unit?.is_active ?? false;
  const statusLabel = isActive ? t('common.on') : t('common.off');
  const statusVariant = isActive ? 'success' : 'warning';
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
  const showInlineError = hasUnit && hasError;
  const showInlineOffline = hasUnit && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('unit.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="unit-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="unit-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('unit.detail.title')} testID="unit-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('unit.detail.idLabel')}</Text>
              <Text variant="body" testID="unit-detail-id">
                {unit.id}
              </Text>
            </StyledDetailItem>
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('unit.detail.tenantLabel')}</Text>
                <Text variant="body" testID="unit-detail-tenant">
                  {tenantId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {name ? (
              <StyledDetailItem>
                <Text variant="label">{t('unit.detail.nameLabel')}</Text>
                <Text variant="body" testID="unit-detail-name">
                  {name}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('unit.detail.activeLabel')}</Text>
              <Badge
                variant={statusVariant}
                size="small"
                accessibilityLabel={t('unit.detail.activeLabel')}
                testID="unit-detail-active"
              >
                {statusLabel}
              </Badge>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('unit.detail.createdLabel')}</Text>
                <Text variant="body" testID="unit-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('unit.detail.updatedLabel')}</Text>
                <Text variant="body" testID="unit-detail-updated">
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
            accessibilityHint={t('unit.detail.backHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="unit-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('unit.detail.edit')}
              accessibilityHint={t('unit.detail.editHint')}
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="unit-detail-edit"
              disabled={isLoading}
            >
              {t('unit.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('unit.detail.delete')}
            accessibilityHint={t('unit.detail.deleteHint')}
            icon={<Icon glyph="✕" size="xs" decorative />}
            testID="unit-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UnitDetailScreenAndroid;
