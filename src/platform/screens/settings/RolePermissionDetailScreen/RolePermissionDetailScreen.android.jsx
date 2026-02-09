/**
 * RolePermissionDetailScreen - Android
 * File: RolePermissionDetailScreen.android.jsx
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
} from './RolePermissionDetailScreen.android.styles';
import useRolePermissionDetailScreen from './useRolePermissionDetailScreen';

const RolePermissionDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    rolePermission,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useRolePermissionDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="role-permission-detail-loading"
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
              testID="role-permission-detail-offline"
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
              title={t('rolePermission.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="role-permission-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!rolePermission) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('rolePermission.detail.notFoundTitle')}
              description={t('rolePermission.detail.notFoundMessage')}
              testID="role-permission-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="role-permission-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = rolePermission.created_at ? new Date(rolePermission.created_at).toLocaleString() : '';
  const updatedAt = rolePermission.updated_at ? new Date(rolePermission.updated_at).toLocaleString() : '';
  const roleId = rolePermission?.role_id ?? '';
  const permissionId = rolePermission?.permission_id ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="role-permission-detail-title"
          >
            {t('rolePermission.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="role-permission-detail-id">
              {t('rolePermission.detail.idLabel')}: {rolePermission.id}
            </Text>
          </StyledSection>
          {roleId ? (
            <StyledSection>
              <Text variant="body" testID="role-permission-detail-role">
                {t('rolePermission.detail.roleIdLabel')}: {roleId}
              </Text>
            </StyledSection>
          ) : null}
          {permissionId ? (
            <StyledSection>
              <Text variant="body" testID="role-permission-detail-permission">
                {t('rolePermission.detail.permissionIdLabel')}: {permissionId}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="role-permission-detail-created">
                {t('rolePermission.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="role-permission-detail-updated">
                {t('rolePermission.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('rolePermission.detail.backHint')}
              testID="role-permission-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('rolePermission.detail.edit')}
                accessibilityHint={t('rolePermission.detail.editHint')}
                testID="role-permission-detail-edit"
              >
                {t('rolePermission.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('rolePermission.detail.delete')}
              accessibilityHint={t('rolePermission.detail.deleteHint')}
              testID="role-permission-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default RolePermissionDetailScreenAndroid;
