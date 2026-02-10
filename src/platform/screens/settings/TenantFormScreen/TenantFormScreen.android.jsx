/**
 * TenantFormScreen - Android
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
import { StyledContainer, StyledContent, StyledSection, StyledActions, StyledScrollView } from './TenantFormScreen.android.styles';
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
    tenant,
    onSubmit,
    onCancel,
  } = useTenantFormScreen();

  if (isEdit && !tenant && isLoading) {
    return (
      <StyledScrollView>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-form-loading" />
          </StyledContent>
        </StyledContainer>
      </StyledScrollView>
    );
  }

  if (isEdit && hasError && !tenant) {
    return (
      <StyledScrollView>
        <StyledContainer>
          <StyledContent>
            <ErrorState
              title={t('tenant.form.loadError')}
              action={
                <Button
                  variant="primary"
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
      </StyledScrollView>
    );
  }

  return (
    <StyledScrollView>
      <StyledContainer>
        <StyledContent>
          <Text variant="h1" accessibilityRole="header" testID="tenant-form-title">
            {isEdit ? t('tenant.form.editTitle') : t('tenant.form.createTitle')}
          </Text>
          <StyledSection>
            <TextField
              label={t('tenant.form.nameLabel')}
              placeholder={t('tenant.form.namePlaceholder')}
              value={name}
              onChangeText={setName}
              accessibilityLabel={t('tenant.form.nameLabel')}
              accessibilityHint={t('tenant.form.nameHint')}
              testID="tenant-form-name"
            />
          </StyledSection>
          <StyledSection>
            <TextField
              label={t('tenant.form.slugLabel')}
              placeholder={t('tenant.form.slugPlaceholder')}
              value={slug}
              onChangeText={setSlug}
              accessibilityLabel={t('tenant.form.slugLabel')}
              accessibilityHint={t('tenant.form.slugHint')}
              testID="tenant-form-slug"
            />
          </StyledSection>
          <StyledSection>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              label={t('tenant.form.activeLabel')}
              accessibilityLabel={t('tenant.form.activeLabel')}
              accessibilityHint={t('tenant.form.activeHint')}
              testID="tenant-form-active"
            />
          </StyledSection>
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onCancel}
              accessibilityLabel={t('tenant.form.cancel')}
              accessibilityHint={t('tenant.form.cancelHint')}
              testID="tenant-form-cancel"
            >
              {t('tenant.form.cancel')}
            </Button>
            <Button
              variant="primary"
              onPress={onSubmit}
              accessibilityLabel={isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
              accessibilityHint={isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
              testID="tenant-form-submit"
            >
              {isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </StyledScrollView>
  );
};

export default TenantFormScreenAndroid;
