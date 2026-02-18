/**
 * RoleDetailScreen - Android
 * File: RoleDetailScreen.android.jsx
 */
import React from 'react';
import {
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
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './RoleDetailScreen.android.styles';
import useRoleDetailScreen from './useRoleDetailScreen';

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return String(normalized).trim();
  }
  return '';
};

const resolveContextValue = (readableValue, technicalId, canViewTechnicalIds, fallbackLabel) => {
  if (readableValue) return readableValue;
  if (canViewTechnicalIds) return String(technicalId ?? '').trim();
  if (String(technicalId ?? '').trim()) return fallbackLabel;
  return '';
};

const RoleDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    role,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useRoleDetailScreen();

  const hasRole = Boolean(role);

  if (isLoading && !hasRole) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="role-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasRole) {
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
              >
                {t('common.retry')}
              </Button>
            )}
            testID="role-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasRole) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('role.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="role-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!role) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('role.detail.notFoundTitle')}
            description={t('role.detail.notFoundMessage')}
            testID="role-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('role.detail.backHint')}
              testID="role-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(role.created_at, locale);
  const updatedAt = formatDateTime(role.updated_at, locale);
  const name = humanizeIdentifier(role?.name) || t('role.detail.currentRole');
  const description = humanizeIdentifier(role?.description);
  const tenantLabel = resolveContextValue(
    resolveReadableValue(role?.tenant_name, role?.tenant?.name, role?.tenant_label),
    role?.tenant_id,
    canViewTechnicalIds,
    t('role.detail.currentTenant')
  );
  const facilityLabel = resolveContextValue(
    resolveReadableValue(role?.facility_name, role?.facility?.name, role?.facility_label),
    role?.facility_id,
    canViewTechnicalIds,
    t('role.detail.currentFacility')
  );
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasRole && hasError;
  const showInlineOffline = hasRole && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('role.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="role-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="role-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('role.detail.title')} testID="role-detail-card">
          <StyledDetailGrid>
            {canViewTechnicalIds ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.idLabel')}</Text>
                <Text variant="body" testID="role-detail-id">
                  {role.id}
                </Text>
              </StyledDetailItem>
            ) : null}
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.tenantLabel')}</Text>
                <Text variant="body" testID="role-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.facilityLabel')}</Text>
                <Text variant="body" testID="role-detail-facility">
                  {facilityLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {name ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.nameLabel')}</Text>
                <Text variant="body" testID="role-detail-name">
                  {name}
                </Text>
              </StyledDetailItem>
            ) : null}
            {description ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.descriptionLabel')}</Text>
                <Text variant="body" testID="role-detail-description">
                  {description}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.createdLabel')}</Text>
                <Text variant="body" testID="role-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.updatedLabel')}</Text>
                <Text variant="body" testID="role-detail-updated">
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
            accessibilityHint={t('role.detail.backHint')}
            testID="role-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('role.detail.edit')}
              accessibilityHint={t('role.detail.editHint')}
              testID="role-detail-edit"
              disabled={isLoading}
            >
              {t('role.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('role.detail.delete')}
              accessibilityHint={t('role.detail.deleteHint')}
              testID="role-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoleDetailScreenAndroid;
