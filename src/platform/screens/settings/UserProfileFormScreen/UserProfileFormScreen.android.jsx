/**
 * UserProfileFormScreen - Android
 */
import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledHelperStack,
  StyledInlineStates,
} from './UserProfileFormScreen.android.styles';
import useUserProfileFormScreen from './useUserProfileFormScreen';

const UserProfileFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    userId,
    setUserId,
    facilityId,
    setFacilityId,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    gender,
    setGender,
    genderOptions,
    dateOfBirth,
    setDateOfBirth,
    userOptions,
    userListLoading,
    userListError,
    userErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    hasUsers,
    hasFacilities,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    profile,
    onSubmit,
    onCancel,
    onGoToUsers,
    onGoToFacilities,
    onRetryUsers,
    onRetryFacilities,
    isSubmitDisabled,
  } = useUserProfileFormScreen();

  if (isEdit && !profile && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-profile-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !profile) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('userProfile.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('userProfile.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="user-profile-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && isCreateBlocked);
  const retryUsersAction = onRetryUsers ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryUsers}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="user-profile-form-user-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryFacilitiesAction = onRetryFacilities ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryFacilities}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="user-profile-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(profile));
  const blockedMessage = t('userProfile.form.blockedMessage');

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="user-profile-form-title">
          {isEdit ? t('userProfile.form.editTitle') : t('userProfile.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="user-profile-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userProfile.form.submitErrorTitle')}
              description={errorMessage}
              testID="user-profile-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('userProfile.form.firstNameLabel')} testID="user-profile-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {userListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="user-profile-form-user-loading"
                    />
                  ) : userListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('userProfile.form.userLoadErrorTitle')}
                      description={userErrorMessage}
                      action={retryUsersAction}
                      testID="user-profile-form-user-error"
                    />
                  ) : !hasUsers ? (
                    <StyledHelperStack>
                      <Text variant="body">{t('userProfile.form.noUsersMessage')}</Text>
                      <Text variant="body">{t('userProfile.form.createUserFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToUsers}
                        accessibilityLabel={t('userProfile.form.goToUsers')}
                        accessibilityHint={t('userProfile.form.goToUsersHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="user-profile-form-go-to-users"
                      >
                        {t('userProfile.form.goToUsers')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('userProfile.form.userLabel')}
                      placeholder={t('userProfile.form.userPlaceholder')}
                      options={userOptions}
                      value={userId}
                      onValueChange={setUserId}
                      accessibilityLabel={t('userProfile.form.userLabel')}
                      accessibilityHint={t('userProfile.form.userHint')}
                      helperText={t('userProfile.form.userHint')}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="user-profile-form-user"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('userProfile.form.userLabel')}
                    value={userId}
                    accessibilityLabel={t('userProfile.form.userLabel')}
                    accessibilityHint={t('userProfile.form.userLockedHint')}
                    helperText={t('userProfile.form.userLockedHint')}
                    disabled
                    testID="user-profile-form-user-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFullRow>
              <StyledFieldGroup>
                {facilityListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="user-profile-form-facility-loading"
                  />
                ) : facilityListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('userProfile.form.facilityLoadErrorTitle')}
                    description={facilityErrorMessage}
                    action={retryFacilitiesAction}
                    testID="user-profile-form-facility-error"
                  />
                ) : !hasFacilities ? (
                  <StyledHelperStack>
                    <Text variant="body">{t('userProfile.form.noFacilitiesMessage')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToFacilities}
                      accessibilityLabel={t('userProfile.form.goToFacilities')}
                      accessibilityHint={t('userProfile.form.goToFacilitiesHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                      testID="user-profile-form-go-to-facilities"
                    >
                      {t('userProfile.form.goToFacilities')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('userProfile.form.facilityLabel')}
                    placeholder={t('userProfile.form.facilityPlaceholder')}
                    options={facilityOptions}
                    value={facilityId}
                    onValueChange={setFacilityId}
                    accessibilityLabel={t('userProfile.form.facilityLabel')}
                    accessibilityHint={t('userProfile.form.facilityHint')}
                    helperText={t('userProfile.form.facilityHint')}
                    compact
                    disabled={isFormDisabled}
                    testID="user-profile-form-facility"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFieldGroup>
              <TextField
                label={t('userProfile.form.firstNameLabel')}
                placeholder={t('userProfile.form.firstNamePlaceholder')}
                value={firstName}
                onChangeText={setFirstName}
                accessibilityLabel={t('userProfile.form.firstNameLabel')}
                accessibilityHint={t('userProfile.form.firstNameHint')}
                helperText={isCreateBlocked ? blockedMessage : t('userProfile.form.firstNameHint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="user-profile-form-first-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('userProfile.form.middleNameLabel')}
                placeholder={t('userProfile.form.middleNamePlaceholder')}
                value={middleName}
                onChangeText={setMiddleName}
                accessibilityLabel={t('userProfile.form.middleNameLabel')}
                accessibilityHint={t('userProfile.form.middleNameHint')}
                helperText={isCreateBlocked ? blockedMessage : t('userProfile.form.middleNameHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="user-profile-form-middle-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('userProfile.form.lastNameLabel')}
                placeholder={t('userProfile.form.lastNamePlaceholder')}
                value={lastName}
                onChangeText={setLastName}
                accessibilityLabel={t('userProfile.form.lastNameLabel')}
                accessibilityHint={t('userProfile.form.lastNameHint')}
                helperText={isCreateBlocked ? blockedMessage : t('userProfile.form.lastNameHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="user-profile-form-last-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Select
                label={t('userProfile.form.genderLabel')}
                placeholder={t('userProfile.form.genderPlaceholder')}
                options={genderOptions}
                value={gender}
                onValueChange={setGender}
                accessibilityLabel={t('userProfile.form.genderLabel')}
                accessibilityHint={t('userProfile.form.genderHint')}
                helperText={isCreateBlocked ? blockedMessage : t('userProfile.form.genderHint')}
                compact
                disabled={isFormDisabled}
                testID="user-profile-form-gender"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('userProfile.form.dobLabel')}
                placeholder={t('userProfile.form.dobPlaceholder')}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                type="date"
                accessibilityLabel={t('userProfile.form.dobLabel')}
                accessibilityHint={t('userProfile.form.dobHint')}
                helperText={isCreateBlocked ? blockedMessage : t('userProfile.form.dobHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="user-profile-form-dob"
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('userProfile.form.cancel')}
            accessibilityHint={t('userProfile.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="user-profile-form-cancel"
            disabled={isLoading}
          >
            {t('userProfile.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('userProfile.form.submitEdit') : t('userProfile.form.submitCreate')}
            accessibilityHint={isEdit ? t('userProfile.form.submitEdit') : t('userProfile.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="user-profile-form-submit"
          >
            {isEdit ? t('userProfile.form.submitEdit') : t('userProfile.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserProfileFormScreenAndroid;
