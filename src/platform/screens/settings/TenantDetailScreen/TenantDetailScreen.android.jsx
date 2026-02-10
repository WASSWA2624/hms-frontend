/**
 * TenantDetailScreen - Android
 * File: TenantDetailScreen.android.jsx
 */
import React from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  OfflineState,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledSection,
  StyledActions,
  StyledScrollView,
} from './TenantDetailScreen.android.styles';
import useTenantDetailScreen from './useTenantDetailScreen';

const TenantDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    tenant,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useTenantDetailScreen();

  if (isLoading) {
    return (
      <StyledScrollView>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="tenant-detail-loading"
            />
          </StyledContent>
        </StyledContainer>
      </StyledScrollView>
    );
  }

  if (isOffline) {
    return (
      <StyledScrollView>
        <StyledContainer>
          <StyledContent>
            <OfflineState
              action={
                <Button
                  onPress={onRetry}
                  accessibilityLabel={t('common.retry')}
                  accessibilityHint={t('common.retryHint')}
                >
                  {t('common.retry')}
                </Button>
              }
              testID="tenant-detail-offline"
            />
          </StyledContent>
        </StyledContainer>
      </StyledScrollView>
    );
  }

  if (hasError) {
    return (
      <StyledScrollView>
        <StyledContainer>
          <StyledContent>
            <ErrorState
              title={t('tenant.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button
                  onPress={onRetry}
                  accessibilityLabel={t('common.retry')}
                  accessibilityHint={t('common.retryHint')}
                >
                  {t('common.retry')}
                </Button>
              }
              testID="tenant-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </StyledScrollView>
    );
  }

  if (!tenant) {
    return (
      <StyledScrollView>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('tenant.detail.notFoundTitle')}
              description={t('tenant.detail.notFoundMessage')}
              testID="tenant-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('tenant.detail.backHint')}
                testID="tenant-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </StyledScrollView>
    );
  }

  const createdAt = formatDateTime(tenant.created_at, locale);
  const updatedAt = formatDateTime(tenant.updated_at, locale);
  const name = tenant?.name ?? '';
  const slug = tenant?.slug ?? '';
  const isActive = tenant?.is_active ?? false;

  return (
    <StyledScrollView>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="tenant-detail-title"
          >
            {t('tenant.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="tenant-detail-id">
              {t('tenant.detail.idLabel')}: {tenant.id}
            </Text>
          </StyledSection>
          {name ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-name">
                {t('tenant.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {slug ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-slug">
                {t('tenant.detail.slugLabel')}: {slug}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="tenant-detail-active">
              {t('tenant.detail.activeLabel')}: {isActive ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-created">
                {t('tenant.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-updated">
                {t('tenant.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('tenant.detail.backHint')}
              testID="tenant-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('tenant.detail.edit')}
                accessibilityHint={t('tenant.detail.editHint')}
                testID="tenant-detail-edit"
              >
                {t('tenant.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('tenant.detail.delete')}
              accessibilityHint={t('tenant.detail.deleteHint')}
              testID="tenant-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </StyledScrollView>
  );
};

export default TenantDetailScreenAndroid;
