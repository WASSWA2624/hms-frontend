/**
 * UserMfaDetailScreen - iOS
 * File: UserMfaDetailScreen.ios.jsx
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
} from './UserMfaDetailScreen.ios.styles';
import useUserMfaDetailScreen from './useUserMfaDetailScreen';

const UserMfaDetailScreenIOS = () => {
  const { t } = useI18n();
  const {
    userMfa,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUserMfaDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="user-mfa-detail-loading"
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
              testID="user-mfa-detail-offline"
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
              title={t('userMfa.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="user-mfa-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!userMfa) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('userMfa.detail.notFoundTitle')}
              description={t('userMfa.detail.notFoundMessage')}
              testID="user-mfa-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="user-mfa-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = userMfa.created_at ? new Date(userMfa.created_at).toLocaleString() : '';
  const updatedAt = userMfa.updated_at ? new Date(userMfa.updated_at).toLocaleString() : '';
  const lastUsedAt = userMfa.last_used_at ? new Date(userMfa.last_used_at).toLocaleString() : '';
  const userId = userMfa?.user_id ?? '';
  const channel = userMfa?.channel ?? '';
  const isEnabled = userMfa?.is_enabled ?? false;
  const resolveChannelLabel = (value) => {
    if (!value) return '';
    const key = `userMfa.channel.${value}`;
    const resolved = t(key);
    return resolved === key ? value : resolved;
  };
  const channelLabel = resolveChannelLabel(channel);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="user-mfa-detail-title"
          >
            {t('userMfa.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="user-mfa-detail-id">
              {t('userMfa.detail.idLabel')}: {userMfa.id}
            </Text>
          </StyledSection>
          {userId ? (
            <StyledSection>
              <Text variant="body" testID="user-mfa-detail-user">
                {t('userMfa.detail.userIdLabel')}: {userId}
              </Text>
            </StyledSection>
          ) : null}
          {channelLabel ? (
            <StyledSection>
              <Text variant="body" testID="user-mfa-detail-channel">
                {t('userMfa.detail.channelLabel')}: {channelLabel}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="user-mfa-detail-enabled">
              {t('userMfa.detail.enabledLabel')}: {isEnabled ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {lastUsedAt ? (
            <StyledSection>
              <Text variant="body" testID="user-mfa-detail-last-used">
                {t('userMfa.detail.lastUsedLabel')}: {lastUsedAt}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="user-mfa-detail-created">
                {t('userMfa.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="user-mfa-detail-updated">
                {t('userMfa.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userMfa.detail.backHint')}
              testID="user-mfa-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('userMfa.detail.edit')}
                accessibilityHint={t('userMfa.detail.editHint')}
                testID="user-mfa-detail-edit"
              >
                {t('userMfa.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('userMfa.detail.delete')}
              accessibilityHint={t('userMfa.detail.deleteHint')}
              testID="user-mfa-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default UserMfaDetailScreenIOS;
