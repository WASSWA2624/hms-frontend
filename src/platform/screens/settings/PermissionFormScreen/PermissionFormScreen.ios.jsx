/**
 * PermissionFormScreen - iOS
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
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './PermissionFormScreen.ios.styles';
import usePermissionFormScreen from './usePermissionFormScreen';

const PermissionFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    name,
    setName,
    description,
    setDescription,
    isLoading,
    hasError,
    permission,
    onSubmit,
    onCancel,
  } = usePermissionFormScreen();

  if (isEdit && !permission && isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner accessibilityLabel={t('common.loading')} testID="permission-form-loading" />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (isEdit && hasError && !permission) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <ErrorState
              title={t('permission.form.loadError')}
              action={(
                <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                  {t('common.back')}
                </Button>
              )}
              testID="permission-form-load-error"
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
          <Text variant="h1" accessibilityRole="header" testID="permission-form-title">
            {isEdit ? t('permission.form.editTitle') : t('permission.form.createTitle')}
          </Text>

          {!isEdit && (
            <StyledSection>
              <TextField
                label={t('permission.form.tenantIdLabel')}
                placeholder={t('permission.form.tenantIdPlaceholder')}
                value={tenantId}
                onChangeText={setTenantId}
                accessibilityLabel={t('permission.form.tenantIdLabel')}
                accessibilityHint={t('permission.form.tenantIdHint')}
                testID="permission-form-tenant-id"
              />
            </StyledSection>
          )}

          <StyledSection>
            <TextField
              label={t('permission.form.nameLabel')}
              placeholder={t('permission.form.namePlaceholder')}
              value={name}
              onChangeText={setName}
              accessibilityLabel={t('permission.form.nameLabel')}
              accessibilityHint={t('permission.form.nameHint')}
              testID="permission-form-name"
            />
          </StyledSection>

          <StyledSection>
            <TextArea
              label={t('permission.form.descriptionLabel')}
              placeholder={t('permission.form.descriptionPlaceholder')}
              value={description}
              onChangeText={setDescription}
              accessibilityLabel={t('permission.form.descriptionLabel')}
              accessibilityHint={t('permission.form.descriptionHint')}
              testID="permission-form-description"
            />
          </StyledSection>

          <StyledActions>
            <Button
              variant="ghost"
              onPress={onCancel}
              accessibilityLabel={t('permission.form.cancel')}
              accessibilityHint={t('permission.form.cancelHint')}
              testID="permission-form-cancel"
            >
              {t('permission.form.cancel')}
            </Button>
            <Button
              variant="primary"
              onPress={onSubmit}
              accessibilityLabel={isEdit ? t('permission.form.submitEdit') : t('permission.form.submitCreate')}
              testID="permission-form-submit"
            >
              {isEdit ? t('permission.form.submitEdit') : t('permission.form.submitCreate')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default PermissionFormScreenIOS;
