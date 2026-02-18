/**
 * BranchDetailScreen - Web
 * File: BranchDetailScreen.web.jsx
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
import { formatDateTime, humanizeIdentifier } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './BranchDetailScreen.web.styles';
import useBranchDetailScreen from './useBranchDetailScreen';

const BranchDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    branch,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useBranchDetailScreen();

  const hasBranch = Boolean(branch);

  if (isLoading && !hasBranch) {
    return (
      <StyledContainer role="main" aria-label={t('branch.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="branch-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasBranch) {
    return (
      <StyledContainer role="main" aria-label={t('branch.detail.title')}>
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
            testID="branch-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasBranch) {
    return (
      <StyledContainer role="main" aria-label={t('branch.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('branch.detail.errorTitle')}
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
            testID="branch-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!branch) {
    return (
      <StyledContainer role="main" aria-label={t('branch.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('branch.detail.notFoundTitle')}
            description={t('branch.detail.notFoundMessage')}
            testID="branch-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('branch.detail.backHint')}
              icon={<Icon glyph="←" size="xs" decorative />}
              testID="branch-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(branch.created_at, locale);
  const updatedAt = formatDateTime(branch.updated_at, locale);
  const displayName = humanizeIdentifier(branch?.name) || t('branch.detail.nameFallback');
  const tenantLabel = humanizeIdentifier(
    branch?.tenant_name
    ?? branch?.tenant?.name
    ?? branch?.tenant_label
    ?? branch?.tenant_id
  );
  const facilityLabel = humanizeIdentifier(
    branch?.facility_name
    ?? branch?.facility?.name
    ?? branch?.facility_label
    ?? branch?.facility_id
  );
  const isActive = branch?.is_active ?? false;
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
  const showInlineError = hasBranch && hasError;
  const showInlineOffline = hasBranch && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('branch.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('branch.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="branch-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="branch-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('branch.detail.title')} testID="branch-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('branch.detail.nameLabel')}</Text>
              <Text variant="body" testID="branch-detail-name">
                {displayName}
              </Text>
            </StyledDetailItem>
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('branch.detail.tenantLabel')}</Text>
                <Text variant="body" testID="branch-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('branch.detail.facilityLabel')}</Text>
                <Text variant="body" testID="branch-detail-facility">
                  {facilityLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('branch.detail.activeLabel')}</Text>
              <Badge
                variant={statusVariant}
                size="small"
                accessibilityLabel={t('branch.detail.activeLabel')}
                testID="branch-detail-active"
              >
                {statusLabel}
              </Badge>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('branch.detail.createdLabel')}</Text>
                <Text variant="body" testID="branch-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('branch.detail.updatedLabel')}</Text>
                <Text variant="body" testID="branch-detail-updated">
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
            accessibilityHint={t('branch.detail.backHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="branch-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('branch.detail.edit')}
              accessibilityHint={t('branch.detail.editHint')}
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="branch-detail-edit"
              disabled={isLoading}
            >
              {t('branch.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('branch.detail.delete')}
              accessibilityHint={t('branch.detail.deleteHint')}
              icon={<Icon glyph="✕" size="xs" decorative />}
              testID="branch-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default BranchDetailScreenWeb;

