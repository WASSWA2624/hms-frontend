/**
 * UserRoleDetailScreen - Android
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
import { formatDateTime } from '@utils';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './UserRoleDetailScreen.android.styles';
import useUserRoleDetailScreen from './useUserRoleDetailScreen';

const UserRoleDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    userRole,
    userLabel,
    roleLabel,
    tenantLabel,
    facilityLabel,
    canViewTechnicalIds,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUserRoleDetailScreen();

  const hasUserRole = Boolean(userRole);

  if (isLoading && !hasUserRole) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="user-role-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasUserRole) {
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
            testID="user-role-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasUserRole) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('userRole.detail.errorTitle')}
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
            testID="user-role-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!userRole) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('userRole.detail.notFoundTitle')}
            description={t('userRole.detail.notFoundMessage')}
            testID="user-role-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userRole.detail.backHint')}
              testID="user-role-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(userRole?.created_at, locale);
  const updatedAt = formatDateTime(userRole?.updated_at, locale);
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
  const showInlineError = hasUserRole && hasError;
  const showInlineOffline = hasUserRole && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userRole.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="user-role-detail-error-banner"
            />
          ) : null}

          {showInlineOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="user-role-detail-offline-banner"
            />
          ) : null}
        </StyledInlineStates>

        <Card
          variant="outlined"
          accessibilityLabel={t('userRole.detail.title')}
          testID="user-role-detail-card"
        >
          <StyledDetailGrid>
            {canViewTechnicalIds ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.idLabel')}</Text>
                <Text variant="body" testID="user-role-detail-id">
                  {userRole.id}
                </Text>
              </StyledDetailItem>
            ) : null}

            {userLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.userLabel')}</Text>
                <Text variant="body" testID="user-role-detail-user">
                  {userLabel}
                </Text>
              </StyledDetailItem>
            ) : null}

            {roleLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.roleLabel')}</Text>
                <Text variant="body" testID="user-role-detail-role">
                  {roleLabel}
                </Text>
              </StyledDetailItem>
            ) : null}

            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.tenantLabel')}</Text>
                <Text variant="body" testID="user-role-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}

            {facilityLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.facilityLabel')}</Text>
                <Text variant="body" testID="user-role-detail-facility">
                  {facilityLabel}
                </Text>
              </StyledDetailItem>
            ) : null}

            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.createdLabel')}</Text>
                <Text variant="body" testID="user-role-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}

            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userRole.detail.updatedLabel')}</Text>
                <Text variant="body" testID="user-role-detail-updated">
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
            accessibilityHint={t('userRole.detail.backHint')}
            testID="user-role-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>

          {onEdit ? (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('userRole.detail.edit')}
              accessibilityHint={t('userRole.detail.editHint')}
              testID="user-role-detail-edit"
              disabled={isLoading}
            >
              {t('userRole.detail.edit')}
            </Button>
          ) : null}

          {onDelete ? (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('userRole.detail.delete')}
              accessibilityHint={t('userRole.detail.deleteHint')}
              testID="user-role-detail-delete"
            >
              {t('common.remove')}
            </Button>
          ) : null}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserRoleDetailScreenAndroid;
