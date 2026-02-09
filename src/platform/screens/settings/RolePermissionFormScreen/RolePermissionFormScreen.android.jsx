/**
 * RolePermissionFormScreen - Android
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
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './RolePermissionFormScreen.android.styles';
import useRolePermissionFormScreen from './useRolePermissionFormScreen';

const RolePermissionFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    roleId,
    setRoleId,
    permissionId,
    setPermissionId,
    isLoading,
    hasError,
    rolePermission,
    onSubmit,
    onCancel,
  } = useRolePermissionFormScreen();

  if (isEdit && !rolePermission && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="role-permission-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !rolePermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('rolePermission.form.loadError')}
            action={(
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="role-permission-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="role-permission-form-title">
          {isEdit ? t('rolePermission.form.editTitle') : t('rolePermission.form.createTitle')}
        </Text>

        <StyledSection>
          <TextField
            label={t('rolePermission.form.roleIdLabel')}
            placeholder={t('rolePermission.form.roleIdPlaceholder')}
            value={roleId}
            onChangeText={setRoleId}
            accessibilityLabel={t('rolePermission.form.roleIdLabel')}
            accessibilityHint={t('rolePermission.form.roleIdHint')}
            testID="role-permission-form-role-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('rolePermission.form.permissionIdLabel')}
            placeholder={t('rolePermission.form.permissionIdPlaceholder')}
            value={permissionId}
            onChangeText={setPermissionId}
            accessibilityLabel={t('rolePermission.form.permissionIdLabel')}
            accessibilityHint={t('rolePermission.form.permissionIdHint')}
            testID="role-permission-form-permission-id"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('rolePermission.form.cancel')}
            accessibilityHint={t('rolePermission.form.cancelHint')}
            testID="role-permission-form-cancel"
          >
            {t('rolePermission.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('rolePermission.form.submitEdit') : t('rolePermission.form.submitCreate')}
            testID="role-permission-form-submit"
          >
            {isEdit ? t('rolePermission.form.submitEdit') : t('rolePermission.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RolePermissionFormScreenAndroid;
