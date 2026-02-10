/**
 * TenantFormScreen - Android
 */
import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Switch,
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
  StyledInlineStates,
} from './TenantFormScreen.android.styles';
import useTenantFormScreen from './useTenantFormScreen';

const TenantFormScreenAndroid = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    slug,
    setSlug,
    isActive,
    setIsActive,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    tenant,
    onSubmit,
    onCancel,
  } = useTenantFormScreen();

  if (isEdit && !tenant && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !tenant) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('tenant.form.loadError')}
            action={
              <Button
                variant="primary"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('tenant.form.cancelHint')}
              >
                {t('common.back')}
              </Button>
            }
            testID="tenant-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const showInlineError = hasError && (!isEdit || Boolean(tenant));
  const showInlineOffline = isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="tenant-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('tenant.form.submitErrorTitle')}
              description={errorMessage}
              testID="tenant-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('tenant.form.nameLabel')} testID="tenant-form-card">
          <StyledFormGrid>
            <StyledFieldGroup>
              <TextField
                label={t('tenant.form.nameLabel')}
                placeholder={t('tenant.form.namePlaceholder')}
                value={name}
                onChangeText={setName}
                accessibilityLabel={t('tenant.form.nameLabel')}
                accessibilityHint={t('tenant.form.nameHint')}
                helperText={t('tenant.form.nameHint')}
                required
                density="compact"
                disabled={isLoading}
                testID="tenant-form-name"
              />
            </StyledFieldGroup>
            <StyledFieldGroup>
              <TextField
                label={t('tenant.form.slugLabel')}
                placeholder={t('tenant.form.slugPlaceholder')}
                value={slug}
                onChangeText={setSlug}
                accessibilityLabel={t('tenant.form.slugLabel')}
                accessibilityHint={t('tenant.form.slugHint')}
                helperText={t('tenant.form.slugHint')}
                density="compact"
                disabled={isLoading}
                testID="tenant-form-slug"
              />
            </StyledFieldGroup>
            <StyledFullRow>
              <StyledFieldGroup>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  label={t('tenant.form.activeLabel')}
                  accessibilityLabel={t('tenant.form.activeLabel')}
                  accessibilityHint={t('tenant.form.activeHint')}
                  disabled={isLoading}
                  testID="tenant-form-active"
                />
                <Text variant="caption">{t('tenant.form.activeHint')}</Text>
              </StyledFieldGroup>
            </StyledFullRow>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="ghost"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('tenant.form.cancel')}
            accessibilityHint={t('tenant.form.cancelHint')}
            testID="tenant-form-cancel"
            disabled={isLoading}
          >
            {t('tenant.form.cancel')}
          </Button>
          <Button
            variant="primary"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            accessibilityLabel={isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
            accessibilityHint={isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
            testID="tenant-form-submit"
          >
            {isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default TenantFormScreenAndroid;
