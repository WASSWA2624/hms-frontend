/**
 * UserProfileFormScreen - Web
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './UserProfileFormScreen.web.styles';
import useUserProfileFormScreen from './useUserProfileFormScreen';

const UserProfileFormScreenWeb = () => {
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
    isLoading,
    hasError,
    profile,
    onSubmit,
    onCancel,
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
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="user-profile-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="user-profile-form-title">
          {isEdit ? t('userProfile.form.editTitle') : t('userProfile.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('userProfile.form.userIdLabel')}
              placeholder={t('userProfile.form.userIdPlaceholder')}
              value={userId}
              onChangeText={setUserId}
              accessibilityLabel={t('userProfile.form.userIdLabel')}
              accessibilityHint={t('userProfile.form.userIdHint')}
              testID="user-profile-form-user-id"
            />
          </StyledSection>
        )}

        <StyledSection>
          <TextField
            label={t('userProfile.form.facilityIdLabel')}
            placeholder={t('userProfile.form.facilityIdPlaceholder')}
            value={facilityId}
            onChangeText={setFacilityId}
            accessibilityLabel={t('userProfile.form.facilityIdLabel')}
            accessibilityHint={t('userProfile.form.facilityIdHint')}
            testID="user-profile-form-facility-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userProfile.form.firstNameLabel')}
            placeholder={t('userProfile.form.firstNamePlaceholder')}
            value={firstName}
            onChangeText={setFirstName}
            accessibilityLabel={t('userProfile.form.firstNameLabel')}
            accessibilityHint={t('userProfile.form.firstNameHint')}
            testID="user-profile-form-first-name"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userProfile.form.middleNameLabel')}
            placeholder={t('userProfile.form.middleNamePlaceholder')}
            value={middleName}
            onChangeText={setMiddleName}
            accessibilityLabel={t('userProfile.form.middleNameLabel')}
            accessibilityHint={t('userProfile.form.middleNameHint')}
            testID="user-profile-form-middle-name"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userProfile.form.lastNameLabel')}
            placeholder={t('userProfile.form.lastNamePlaceholder')}
            value={lastName}
            onChangeText={setLastName}
            accessibilityLabel={t('userProfile.form.lastNameLabel')}
            accessibilityHint={t('userProfile.form.lastNameHint')}
            testID="user-profile-form-last-name"
          />
        </StyledSection>

        <StyledSection>
          <Select
            label={t('userProfile.form.genderLabel')}
            placeholder={t('userProfile.form.genderPlaceholder')}
            options={genderOptions}
            value={gender}
            onValueChange={setGender}
            accessibilityLabel={t('userProfile.form.genderLabel')}
            accessibilityHint={t('userProfile.form.genderHint')}
            testID="user-profile-form-gender"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userProfile.form.dobLabel')}
            placeholder={t('userProfile.form.dobPlaceholder')}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            type="date"
            accessibilityLabel={t('userProfile.form.dobLabel')}
            accessibilityHint={t('userProfile.form.dobHint')}
            testID="user-profile-form-dob"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('userProfile.form.cancel')}
            accessibilityHint={t('userProfile.form.cancelHint')}
            testID="user-profile-form-cancel"
          >
            {t('userProfile.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('userProfile.form.submitEdit') : t('userProfile.form.submitCreate')}
            testID="user-profile-form-submit"
          >
            {isEdit ? t('userProfile.form.submitEdit') : t('userProfile.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserProfileFormScreenWeb;
