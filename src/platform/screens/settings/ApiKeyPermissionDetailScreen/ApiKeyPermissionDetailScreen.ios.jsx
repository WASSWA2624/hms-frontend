/**
 * ApiKeyPermissionDetailScreen - iOS
 * File: ApiKeyPermissionDetailScreen.ios.jsx
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
} from './ApiKeyPermissionDetailScreen.ios.styles';
import useApiKeyPermissionDetailScreen from './useApiKeyPermissionDetailScreen';

const ApiKeyPermissionDetailScreenIOS = () => {
  const { t } = useI18n();
  const {
    apiKeyPermission,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useApiKeyPermissionDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="api-key-permission-detail-loading"
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
              testID="api-key-permission-detail-offline"
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
              title={t('apiKeyPermission.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="api-key-permission-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!apiKeyPermission) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('apiKeyPermission.detail.notFoundTitle')}
              description={t('apiKeyPermission.detail.notFoundMessage')}
              testID="api-key-permission-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="api-key-permission-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = apiKeyPermission.created_at ? new Date(apiKeyPermission.created_at).toLocaleString() : '';
  const updatedAt = apiKeyPermission.updated_at ? new Date(apiKeyPermission.updated_at).toLocaleString() : '';
  const apiKeyId = apiKeyPermission?.api_key_id ?? '';
  const permissionId = apiKeyPermission?.permission_id ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="api-key-permission-detail-title"
          >
            {t('apiKeyPermission.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="api-key-permission-detail-id">
              {t('apiKeyPermission.detail.idLabel')}: {apiKeyPermission.id}
            </Text>
          </StyledSection>
          {apiKeyId ? (
            <StyledSection>
              <Text variant="body" testID="api-key-permission-detail-api-key">
                {t('apiKeyPermission.detail.apiKeyIdLabel')}: {apiKeyId}
              </Text>
            </StyledSection>
          ) : null}
          {permissionId ? (
            <StyledSection>
              <Text variant="body" testID="api-key-permission-detail-permission">
                {t('apiKeyPermission.detail.permissionIdLabel')}: {permissionId}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="api-key-permission-detail-created">
                {t('apiKeyPermission.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="api-key-permission-detail-updated">
                {t('apiKeyPermission.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('apiKeyPermission.detail.backHint')}
              testID="api-key-permission-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('apiKeyPermission.detail.edit')}
                accessibilityHint={t('apiKeyPermission.detail.editHint')}
                testID="api-key-permission-detail-edit"
              >
                {t('apiKeyPermission.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('apiKeyPermission.detail.delete')}
              accessibilityHint={t('apiKeyPermission.detail.deleteHint')}
              testID="api-key-permission-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default ApiKeyPermissionDetailScreenIOS;
