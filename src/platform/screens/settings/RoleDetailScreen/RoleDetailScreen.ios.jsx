/**
 * RoleDetailScreen - iOS
 * File: RoleDetailScreen.ios.jsx
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
} from './RoleDetailScreen.ios.styles';
import useRoleDetailScreen from './useRoleDetailScreen';

const RoleDetailScreenIOS = () => {
  const { t, locale } = useI18n();
  const {
    role,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
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
                icon={<Icon glyph="↻" size="xs" decorative />}
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
              icon={<Icon glyph="←" size="xs" decorative />}
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
  const tenantId = role?.tenant_id ?? '';
  const facilityId = role?.facility_id ?? '';
  const name = role?.name ?? '';
  const description = role?.description ?? '';
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
            <StyledDetailItem>
              <Text variant="label">{t('role.detail.idLabel')}</Text>
              <Text variant="body" testID="role-detail-id">
                {role.id}
              </Text>
            </StyledDetailItem>
            {tenantId ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.tenantLabel')}</Text>
                <Text variant="body" testID="role-detail-tenant">
                  {tenantId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityId ? (
              <StyledDetailItem>
                <Text variant="label">{t('role.detail.facilityLabel')}</Text>
                <Text variant="body" testID="role-detail-facility">
                  {facilityId}
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
            icon={<Icon glyph="←" size="xs" decorative />}
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
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="role-detail-edit"
              disabled={isLoading}
            >
              {t('role.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('role.detail.delete')}
            accessibilityHint={t('role.detail.deleteHint')}
            icon={<Icon glyph="✕" size="xs" decorative />}
            testID="role-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoleDetailScreenIOS;
