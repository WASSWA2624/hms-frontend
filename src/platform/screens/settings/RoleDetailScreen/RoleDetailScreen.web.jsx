/**
 * RoleDetailScreen - Web
 * File: RoleDetailScreen.web.jsx
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
} from './RoleDetailScreen.web.styles';
import useRoleDetailScreen from './useRoleDetailScreen';

const RoleDetailScreenWeb = () => {
  const { t } = useI18n();
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

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="role-detail-loading"
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
              testID="role-detail-offline"
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
              title={t('role.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="role-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!role) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('role.detail.notFoundTitle')}
              description={t('role.detail.notFoundMessage')}
              testID="role-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="role-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = role.created_at ? new Date(role.created_at).toLocaleString() : '';
  const updatedAt = role.updated_at ? new Date(role.updated_at).toLocaleString() : '';
  const tenantId = role?.tenant_id ?? '';
  const facilityId = role?.facility_id ?? '';
  const name = role?.name ?? '';
  const description = role?.description ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="role-detail-title"
          >
            {t('role.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="role-detail-id">
              {t('role.detail.idLabel')}: {role.id}
            </Text>
          </StyledSection>
          {tenantId ? (
            <StyledSection>
              <Text variant="body" testID="role-detail-tenant">
                {t('role.detail.tenantIdLabel')}: {tenantId}
              </Text>
            </StyledSection>
          ) : null}
          {facilityId ? (
            <StyledSection>
              <Text variant="body" testID="role-detail-facility">
                {t('role.detail.facilityIdLabel')}: {facilityId}
              </Text>
            </StyledSection>
          ) : null}
          {name ? (
            <StyledSection>
              <Text variant="body" testID="role-detail-name">
                {t('role.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {description ? (
            <StyledSection>
              <Text variant="body" testID="role-detail-description">
                {t('role.detail.descriptionLabel')}: {description}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="role-detail-created">
                {t('role.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="role-detail-updated">
                {t('role.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('role.detail.backHint')}
              testID="role-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('role.detail.edit')}
                accessibilityHint={t('role.detail.editHint')}
                testID="role-detail-edit"
              >
                {t('role.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('role.detail.delete')}
              accessibilityHint={t('role.detail.deleteHint')}
              testID="role-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default RoleDetailScreenWeb;
