/**
 * UserRoleFormScreen - iOS
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './UserRoleFormScreen.ios.styles';
import useUserRoleFormScreen from './useUserRoleFormScreen';

const UserRoleFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    userId,
    setUserId,
    roleId,
    setRoleId,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    isLoading,
    hasError,
    userRole,
    onSubmit,
    onCancel,
  } = useUserRoleFormScreen();

  if (isEdit && !userRole && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-role-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !userRole) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('userRole.form.loadError')}
            action={(
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="user-role-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="user-role-form-title">
          {isEdit ? t('userRole.form.editTitle') : t('userRole.form.createTitle')}
        </Text>

        <StyledSection>
          <TextField
            label={t('userRole.form.userIdLabel')}
            placeholder={t('userRole.form.userIdPlaceholder')}
            value={userId}
            onChangeText={setUserId}
            accessibilityLabel={t('userRole.form.userIdLabel')}
            accessibilityHint={t('userRole.form.userIdHint')}
            testID="user-role-form-user-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userRole.form.roleIdLabel')}
            placeholder={t('userRole.form.roleIdPlaceholder')}
            value={roleId}
            onChangeText={setRoleId}
            accessibilityLabel={t('userRole.form.roleIdLabel')}
            accessibilityHint={t('userRole.form.roleIdHint')}
            testID="user-role-form-role-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userRole.form.tenantIdLabel')}
            placeholder={t('userRole.form.tenantIdPlaceholder')}
            value={tenantId}
            onChangeText={setTenantId}
            accessibilityLabel={t('userRole.form.tenantIdLabel')}
            accessibilityHint={t('userRole.form.tenantIdHint')}
            testID="user-role-form-tenant-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('userRole.form.facilityIdLabel')}
            placeholder={t('userRole.form.facilityIdPlaceholder')}
            value={facilityId}
            onChangeText={setFacilityId}
            accessibilityLabel={t('userRole.form.facilityIdLabel')}
            accessibilityHint={t('userRole.form.facilityIdHint')}
            testID="user-role-form-facility-id"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('userRole.form.cancel')}
            accessibilityHint={t('userRole.form.cancelHint')}
            testID="user-role-form-cancel"
          >
            {t('userRole.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('userRole.form.submitEdit') : t('userRole.form.submitCreate')}
            testID="user-role-form-submit"
          >
            {isEdit ? t('userRole.form.submitEdit') : t('userRole.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserRoleFormScreenIOS;
