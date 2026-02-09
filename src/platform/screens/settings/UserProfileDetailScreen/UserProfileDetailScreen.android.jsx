/**
 * UserProfileDetailScreen - Android
 * File: UserProfileDetailScreen.android.jsx
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
} from './UserProfileDetailScreen.android.styles';
import useUserProfileDetailScreen from './useUserProfileDetailScreen';

const UserProfileDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    profile,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUserProfileDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="user-profile-detail-loading"
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
              testID="user-profile-detail-offline"
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
              title={t('userProfile.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="user-profile-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!profile) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('userProfile.detail.notFoundTitle')}
              description={t('userProfile.detail.notFoundMessage')}
              testID="user-profile-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="user-profile-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = profile.created_at ? new Date(profile.created_at).toLocaleString() : '';
  const updatedAt = profile.updated_at ? new Date(profile.updated_at).toLocaleString() : '';
  const dateOfBirth = profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : '';
  const userId = profile?.user_id ?? '';
  const facilityId = profile?.facility_id ?? '';
  const firstName = profile?.first_name ?? '';
  const middleName = profile?.middle_name ?? '';
  const lastName = profile?.last_name ?? '';
  const gender = profile?.gender ?? '';
  const resolveGenderLabel = (value) => {
    if (!value) return '';
    const key = `userProfile.gender.${value}`;
    const resolved = t(key);
    return resolved === key ? value : resolved;
  };
  const genderLabel = resolveGenderLabel(gender);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="user-profile-detail-title"
          >
            {t('userProfile.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="user-profile-detail-id">
              {t('userProfile.detail.idLabel')}: {profile.id}
            </Text>
          </StyledSection>
          {userId ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-user">
                {t('userProfile.detail.userIdLabel')}: {userId}
              </Text>
            </StyledSection>
          ) : null}
          {facilityId ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-facility">
                {t('userProfile.detail.facilityIdLabel')}: {facilityId}
              </Text>
            </StyledSection>
          ) : null}
          {firstName ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-first-name">
                {t('userProfile.detail.firstNameLabel')}: {firstName}
              </Text>
            </StyledSection>
          ) : null}
          {middleName ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-middle-name">
                {t('userProfile.detail.middleNameLabel')}: {middleName}
              </Text>
            </StyledSection>
          ) : null}
          {lastName ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-last-name">
                {t('userProfile.detail.lastNameLabel')}: {lastName}
              </Text>
            </StyledSection>
          ) : null}
          {genderLabel ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-gender">
                {t('userProfile.detail.genderLabel')}: {genderLabel}
              </Text>
            </StyledSection>
          ) : null}
          {dateOfBirth ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-dob">
                {t('userProfile.detail.dobLabel')}: {dateOfBirth}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-created">
                {t('userProfile.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="user-profile-detail-updated">
                {t('userProfile.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userProfile.detail.backHint')}
              testID="user-profile-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('userProfile.detail.edit')}
                accessibilityHint={t('userProfile.detail.editHint')}
                testID="user-profile-detail-edit"
              >
                {t('userProfile.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('userProfile.detail.delete')}
              accessibilityHint={t('userProfile.detail.deleteHint')}
              testID="user-profile-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default UserProfileDetailScreenAndroid;
