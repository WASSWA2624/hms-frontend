/**
 * ApiKeyDetailScreen - Android
 * File: ApiKeyDetailScreen.android.jsx
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
} from './ApiKeyDetailScreen.android.styles';
import useApiKeyDetailScreen from './useApiKeyDetailScreen';

const ApiKeyDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    apiKey,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useApiKeyDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="api-key-detail-loading"
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
              testID="api-key-detail-offline"
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
              title={t('apiKey.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="api-key-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!apiKey) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('apiKey.detail.notFoundTitle')}
              description={t('apiKey.detail.notFoundMessage')}
              testID="api-key-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="api-key-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = apiKey.created_at ? new Date(apiKey.created_at).toLocaleString() : '';
  const updatedAt = apiKey.updated_at ? new Date(apiKey.updated_at).toLocaleString() : '';
  const lastUsedAt = apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleString() : '';
  const expiresAt = apiKey.expires_at ? new Date(apiKey.expires_at).toLocaleString() : '';
  const tenantId = apiKey?.tenant_id ?? '';
  const userId = apiKey?.user_id ?? '';
  const name = apiKey?.name ?? '';
  const isActive = apiKey?.is_active ?? false;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="api-key-detail-title"
          >
            {t('apiKey.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="api-key-detail-id">
              {t('apiKey.detail.idLabel')}: {apiKey.id}
            </Text>
          </StyledSection>
          {tenantId ? (
            <StyledSection>
              <Text variant="body" testID="api-key-detail-tenant">
                {t('apiKey.detail.tenantIdLabel')}: {tenantId}
              </Text>
            </StyledSection>
          ) : null}
          {userId ? (
            <StyledSection>
              <Text variant="body" testID="api-key-detail-user">
                {t('apiKey.detail.userIdLabel')}: {userId}
              </Text>
            </StyledSection>
          ) : null}
          {name ? (
            <StyledSection>
              <Text variant="body" testID="api-key-detail-name">
                {t('apiKey.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="api-key-detail-active">
              {t('apiKey.detail.activeLabel')}: {isActive ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {lastUsedAt ? (
            <StyledSection>
              <Text variant="body" testID="api-key-detail-last-used">
                {t('apiKey.detail.lastUsedLabel')}: {lastUsedAt}
              </Text>
            </StyledSection>
          ) : null}
          {expiresAt ? (
            <StyledSection>
              <Text variant="body" testID="api-key-detail-expires">
                {t('apiKey.detail.expiresLabel')}: {expiresAt}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="api-key-detail-created">
                {t('apiKey.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="api-key-detail-updated">
                {t('apiKey.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('apiKey.detail.backHint')}
              testID="api-key-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('apiKey.detail.edit')}
                accessibilityHint={t('apiKey.detail.editHint')}
                testID="api-key-detail-edit"
              >
                {t('apiKey.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('apiKey.detail.delete')}
              accessibilityHint={t('apiKey.detail.deleteHint')}
              testID="api-key-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default ApiKeyDetailScreenAndroid;
