/**
 * ApiKeyFormScreen - Android
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './ApiKeyFormScreen.android.styles';
import useApiKeyFormScreen from './useApiKeyFormScreen';

const ApiKeyFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    userId,
    setUserId,
    name,
    setName,
    isActive,
    setIsActive,
    expiresAt,
    setExpiresAt,
    isLoading,
    hasError,
    apiKey,
    onSubmit,
    onCancel,
  } = useApiKeyFormScreen();

  if (isEdit && !apiKey && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="api-key-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !apiKey) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('apiKey.form.loadError')}
            action={(
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="api-key-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="api-key-form-title">
          {isEdit ? t('apiKey.form.editTitle') : t('apiKey.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('apiKey.form.tenantIdLabel')}
              placeholder={t('apiKey.form.tenantIdPlaceholder')}
              value={tenantId}
              onChangeText={setTenantId}
              accessibilityLabel={t('apiKey.form.tenantIdLabel')}
              accessibilityHint={t('apiKey.form.tenantIdHint')}
              testID="api-key-form-tenant-id"
            />
          </StyledSection>
        )}

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('apiKey.form.userIdLabel')}
              placeholder={t('apiKey.form.userIdPlaceholder')}
              value={userId}
              onChangeText={setUserId}
              accessibilityLabel={t('apiKey.form.userIdLabel')}
              accessibilityHint={t('apiKey.form.userIdHint')}
              testID="api-key-form-user-id"
            />
          </StyledSection>
        )}

        <StyledSection>
          <TextField
            label={t('apiKey.form.nameLabel')}
            placeholder={t('apiKey.form.namePlaceholder')}
            value={name}
            onChangeText={setName}
            accessibilityLabel={t('apiKey.form.nameLabel')}
            accessibilityHint={t('apiKey.form.nameHint')}
            testID="api-key-form-name"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('apiKey.form.expiresAtLabel')}
            placeholder={t('apiKey.form.expiresAtPlaceholder')}
            value={expiresAt}
            onChangeText={setExpiresAt}
            accessibilityLabel={t('apiKey.form.expiresAtLabel')}
            accessibilityHint={t('apiKey.form.expiresAtHint')}
            testID="api-key-form-expires-at"
          />
        </StyledSection>

        {isEdit && (
          <StyledSection>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              label={t('apiKey.form.activeLabel')}
              accessibilityLabel={t('apiKey.form.activeLabel')}
              accessibilityHint={t('apiKey.form.activeHint')}
              testID="api-key-form-active"
            />
          </StyledSection>
        )}

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('apiKey.form.cancel')}
            accessibilityHint={t('apiKey.form.cancelHint')}
            testID="api-key-form-cancel"
          >
            {t('apiKey.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('apiKey.form.submitEdit') : t('apiKey.form.submitCreate')}
            testID="api-key-form-submit"
          >
            {isEdit ? t('apiKey.form.submitEdit') : t('apiKey.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyFormScreenAndroid;
