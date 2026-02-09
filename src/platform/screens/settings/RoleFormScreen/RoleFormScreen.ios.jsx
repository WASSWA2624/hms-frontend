/**
 * RoleFormScreen - iOS
 */
import React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './RoleFormScreen.ios.styles';
import useRoleFormScreen from './useRoleFormScreen';

const RoleFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    name,
    setName,
    description,
    setDescription,
    isLoading,
    hasError,
    role,
    onSubmit,
    onCancel,
  } = useRoleFormScreen();

  if (isEdit && !role && isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner accessibilityLabel={t('common.loading')} testID="role-form-loading" />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (isEdit && hasError && !role) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <ErrorState
              title={t('role.form.loadError')}
              action={(
                <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                  {t('common.back')}
                </Button>
              )}
              testID="role-form-load-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text variant="h1" accessibilityRole="header" testID="role-form-title">
            {isEdit ? t('role.form.editTitle') : t('role.form.createTitle')}
          </Text>

          {!isEdit && (
            <StyledSection>
              <TextField
                label={t('role.form.tenantIdLabel')}
                placeholder={t('role.form.tenantIdPlaceholder')}
                value={tenantId}
                onChangeText={setTenantId}
                accessibilityLabel={t('role.form.tenantIdLabel')}
                accessibilityHint={t('role.form.tenantIdHint')}
                testID="role-form-tenant-id"
              />
            </StyledSection>
          )}

          <StyledSection>
            <TextField
              label={t('role.form.facilityIdLabel')}
              placeholder={t('role.form.facilityIdPlaceholder')}
              value={facilityId}
              onChangeText={setFacilityId}
              accessibilityLabel={t('role.form.facilityIdLabel')}
              accessibilityHint={t('role.form.facilityIdHint')}
              testID="role-form-facility-id"
            />
          </StyledSection>

          <StyledSection>
            <TextField
              label={t('role.form.nameLabel')}
              placeholder={t('role.form.namePlaceholder')}
              value={name}
              onChangeText={setName}
              accessibilityLabel={t('role.form.nameLabel')}
              accessibilityHint={t('role.form.nameHint')}
              testID="role-form-name"
            />
          </StyledSection>

          <StyledSection>
            <TextArea
              label={t('role.form.descriptionLabel')}
              placeholder={t('role.form.descriptionPlaceholder')}
              value={description}
              onChangeText={setDescription}
              accessibilityLabel={t('role.form.descriptionLabel')}
              accessibilityHint={t('role.form.descriptionHint')}
              testID="role-form-description"
            />
          </StyledSection>

          <StyledActions>
            <Button
              variant="ghost"
              onPress={onCancel}
              accessibilityLabel={t('role.form.cancel')}
              accessibilityHint={t('role.form.cancelHint')}
              testID="role-form-cancel"
            >
              {t('role.form.cancel')}
            </Button>
            <Button
              variant="primary"
              onPress={onSubmit}
              accessibilityLabel={isEdit ? t('role.form.submitEdit') : t('role.form.submitCreate')}
              testID="role-form-submit"
            >
              {isEdit ? t('role.form.submitEdit') : t('role.form.submitCreate')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default RoleFormScreenIOS;
