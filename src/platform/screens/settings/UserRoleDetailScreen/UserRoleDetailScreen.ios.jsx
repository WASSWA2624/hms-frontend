/**
 * UserRoleDetailScreen - iOS
 * File: UserRoleDetailScreen.ios.jsx
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
} from './UserRoleDetailScreen.ios.styles';
import useUserRoleDetailScreen from './useUserRoleDetailScreen';

const UserRoleDetailScreenIOS = () => {
  const { t } = useI18n();
  const {
    userRole,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUserRoleDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="user-role-detail-loading"
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
              testID="user-role-detail-offline"
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
              title={t('userRole.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="user-role-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!userRole) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('userRole.detail.notFoundTitle')}
              description={t('userRole.detail.notFoundMessage')}
              testID="user-role-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="user-role-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = userRole.created_at ? new Date(userRole.created_at).toLocaleString() : '';
  const updatedAt = userRole.updated_at ? new Date(userRole.updated_at).toLocaleString() : '';
  const userId = userRole?.user_id ?? '';
  const roleId = userRole?.role_id ?? '';
  const tenantId = userRole?.tenant_id ?? '';
  const facilityId = userRole?.facility_id ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="user-role-detail-title"
          >
            {t('userRole.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="user-role-detail-id">
              {t('userRole.detail.idLabel')}: {userRole.id}
            </Text>
          </StyledSection>
          {userId ? (
            <StyledSection>
              <Text variant="body" testID="user-role-detail-user">
                {t('userRole.detail.userIdLabel')}: {userId}
              </Text>
            </StyledSection>
          ) : null}
          {roleId ? (
            <StyledSection>
              <Text variant="body" testID="user-role-detail-role">
                {t('userRole.detail.roleIdLabel')}: {roleId}
              </Text>
            </StyledSection>
          ) : null}
          {tenantId ? (
            <StyledSection>
              <Text variant="body" testID="user-role-detail-tenant">
                {t('userRole.detail.tenantIdLabel')}: {tenantId}
              </Text>
            </StyledSection>
          ) : null}
          {facilityId ? (
            <StyledSection>
              <Text variant="body" testID="user-role-detail-facility">
                {t('userRole.detail.facilityIdLabel')}: {facilityId}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="user-role-detail-created">
                {t('userRole.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="user-role-detail-updated">
                {t('userRole.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userRole.detail.backHint')}
              testID="user-role-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('userRole.detail.edit')}
                accessibilityHint={t('userRole.detail.editHint')}
                testID="user-role-detail-edit"
              >
                {t('userRole.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('userRole.detail.delete')}
              accessibilityHint={t('userRole.detail.deleteHint')}
              testID="user-role-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default UserRoleDetailScreenIOS;
