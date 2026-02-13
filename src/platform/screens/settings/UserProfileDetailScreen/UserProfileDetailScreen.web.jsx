/**
 * UserProfileDetailScreen - Web
 * File: UserProfileDetailScreen.web.jsx
 */
import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDate, formatDateTime } from '@utils';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './UserProfileDetailScreen.web.styles';
import useUserProfileDetailScreen from './useUserProfileDetailScreen';

const UserProfileDetailScreenWeb = () => {
  const { t, locale } = useI18n();
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

  const hasProfile = Boolean(profile);

  if (isLoading && !hasProfile) {
    return (
      <StyledContainer role="main" aria-label={t('userProfile.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="user-profile-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasProfile) {
    return (
      <StyledContainer role="main" aria-label={t('userProfile.detail.title')}>
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
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="user-profile-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasProfile) {
    return (
      <StyledContainer role="main" aria-label={t('userProfile.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('userProfile.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="user-profile-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!profile) {
    return (
      <StyledContainer role="main" aria-label={t('userProfile.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('userProfile.detail.notFoundTitle')}
            description={t('userProfile.detail.notFoundMessage')}
            testID="user-profile-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userProfile.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="user-profile-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(profile.created_at, locale);
  const updatedAt = formatDateTime(profile.updated_at, locale);
  const dateOfBirth = formatDate(profile.date_of_birth, locale);
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
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasProfile && hasError;
  const showInlineOffline = hasProfile && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('userProfile.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userProfile.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="user-profile-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="user-profile-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('userProfile.detail.title')} testID="user-profile-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('userProfile.detail.idLabel')}</Text>
              <Text variant="body" testID="user-profile-detail-id">
                {profile.id}
              </Text>
            </StyledDetailItem>
            {userId ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.userIdLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-user">
                  {userId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityId ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.facilityIdLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-facility">
                  {facilityId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {firstName ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.firstNameLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-first-name">
                  {firstName}
                </Text>
              </StyledDetailItem>
            ) : null}
            {middleName ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.middleNameLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-middle-name">
                  {middleName}
                </Text>
              </StyledDetailItem>
            ) : null}
            {lastName ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.lastNameLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-last-name">
                  {lastName}
                </Text>
              </StyledDetailItem>
            ) : null}
            {genderLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.genderLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-gender">
                  {genderLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {dateOfBirth ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.dobLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-dob">
                  {dateOfBirth}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.createdLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userProfile.detail.updatedLabel')}</Text>
                <Text variant="body" testID="user-profile-detail-updated">
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
            accessibilityHint={t('userProfile.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="user-profile-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('userProfile.detail.edit')}
              accessibilityHint={t('userProfile.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="user-profile-detail-edit"
              disabled={isLoading}
            >
              {t('userProfile.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('userProfile.detail.delete')}
              accessibilityHint={t('userProfile.detail.deleteHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="user-profile-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserProfileDetailScreenWeb;
