/**
 * PermissionDetailScreen - iOS
 * File: PermissionDetailScreen.ios.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  OfflineState,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledSection,
  StyledActions,
} from './PermissionDetailScreen.ios.styles';
import usePermissionDetailScreen from './usePermissionDetailScreen';

const PermissionDetailScreenIOS = () => {
  const { t } = useI18n();
  const {
    permission,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = usePermissionDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="permission-detail-loading"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (isOffline) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <OfflineState
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="permission-detail-offline"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (hasError) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <ErrorState
              title={t('permission.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="permission-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!permission) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('permission.detail.notFoundTitle')}
              description={t('permission.detail.notFoundMessage')}
              testID="permission-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="permission-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = permission.created_at ? new Date(permission.created_at).toLocaleString() : '';
  const updatedAt = permission.updated_at ? new Date(permission.updated_at).toLocaleString() : '';
  const tenantId = permission?.tenant_id ?? '';
  const name = permission?.name ?? '';
  const description = permission?.description ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="permission-detail-title"
          >
            {t('permission.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="permission-detail-id">
              {t('permission.detail.idLabel')}: {permission.id}
            </Text>
          </StyledSection>
          {tenantId ? (
            <StyledSection>
              <Text variant="body" testID="permission-detail-tenant">
                {t('permission.detail.tenantIdLabel')}: {tenantId}
              </Text>
            </StyledSection>
          ) : null}
          {name ? (
            <StyledSection>
              <Text variant="body" testID="permission-detail-name">
                {t('permission.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {description ? (
            <StyledSection>
              <Text variant="body" testID="permission-detail-description">
                {t('permission.detail.descriptionLabel')}: {description}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="permission-detail-created">
                {t('permission.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="permission-detail-updated">
                {t('permission.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('permission.detail.backHint')}
              testID="permission-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('permission.detail.edit')}
                accessibilityHint={t('permission.detail.editHint')}
                testID="permission-detail-edit"
              >
                {t('permission.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('permission.detail.delete')}
              accessibilityHint={t('permission.detail.deleteHint')}
              testID="permission-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default PermissionDetailScreenIOS;
