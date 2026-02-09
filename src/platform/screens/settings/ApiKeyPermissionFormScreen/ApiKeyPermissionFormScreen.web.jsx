/**
 * ApiKeyPermissionFormScreen - Web
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
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './ApiKeyPermissionFormScreen.web.styles';
import useApiKeyPermissionFormScreen from './useApiKeyPermissionFormScreen';

const ApiKeyPermissionFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    apiKeyId,
    setApiKeyId,
    permissionId,
    setPermissionId,
    isLoading,
    hasError,
    apiKeyPermission,
    onSubmit,
    onCancel,
  } = useApiKeyPermissionFormScreen();

  if (isEdit && !apiKeyPermission && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="api-key-permission-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !apiKeyPermission) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('apiKeyPermission.form.loadError')}
            action={(
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="api-key-permission-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="api-key-permission-form-title">
          {isEdit ? t('apiKeyPermission.form.editTitle') : t('apiKeyPermission.form.createTitle')}
        </Text>

        <StyledSection>
          <TextField
            label={t('apiKeyPermission.form.apiKeyIdLabel')}
            placeholder={t('apiKeyPermission.form.apiKeyIdPlaceholder')}
            value={apiKeyId}
            onChangeText={setApiKeyId}
            accessibilityLabel={t('apiKeyPermission.form.apiKeyIdLabel')}
            accessibilityHint={t('apiKeyPermission.form.apiKeyIdHint')}
            testID="api-key-permission-form-api-key-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('apiKeyPermission.form.permissionIdLabel')}
            placeholder={t('apiKeyPermission.form.permissionIdPlaceholder')}
            value={permissionId}
            onChangeText={setPermissionId}
            accessibilityLabel={t('apiKeyPermission.form.permissionIdLabel')}
            accessibilityHint={t('apiKeyPermission.form.permissionIdHint')}
            testID="api-key-permission-form-permission-id"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('apiKeyPermission.form.cancel')}
            accessibilityHint={t('apiKeyPermission.form.cancelHint')}
            testID="api-key-permission-form-cancel"
          >
            {t('apiKeyPermission.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('apiKeyPermission.form.submitEdit') : t('apiKeyPermission.form.submitCreate')}
            testID="api-key-permission-form-submit"
          >
            {isEdit ? t('apiKeyPermission.form.submitEdit') : t('apiKeyPermission.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionFormScreenWeb;
