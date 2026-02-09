/**
 * ContactFormScreen - Web
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Select,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './ContactFormScreen.web.styles';
import useContactFormScreen from './useContactFormScreen';

const ContactFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    value,
    setValue,
    contactType,
    setContactType,
    contactTypeOptions,
    isPrimary,
    setIsPrimary,
    tenantId,
    setTenantId,
    isLoading,
    hasError,
    contact,
    onSubmit,
    onCancel,
  } = useContactFormScreen();

  if (isEdit && !contact && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="contact-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !contact) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('contact.form.loadError')}
            action={
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            }
            testID="contact-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="contact-form-title">
          {isEdit ? t('contact.form.editTitle') : t('contact.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('contact.form.tenantIdLabel')}
              placeholder={t('contact.form.tenantIdPlaceholder')}
              value={tenantId}
              onChangeText={setTenantId}
              accessibilityLabel={t('contact.form.tenantIdLabel')}
              accessibilityHint={t('contact.form.tenantIdHint')}
              testID="contact-form-tenant-id"
            />
          </StyledSection>
        )}

        <StyledSection>
          <TextField
            label={t('contact.form.valueLabel')}
            placeholder={t('contact.form.valuePlaceholder')}
            value={value}
            onChangeText={setValue}
            accessibilityLabel={t('contact.form.valueLabel')}
            accessibilityHint={t('contact.form.valueHint')}
            testID="contact-form-value"
          />
        </StyledSection>

        <StyledSection>
          <Select
            label={t('contact.form.typeLabel')}
            placeholder={t('contact.form.typePlaceholder')}
            options={contactTypeOptions}
            value={contactType}
            onValueChange={setContactType}
            accessibilityLabel={t('contact.form.typeLabel')}
            accessibilityHint={t('contact.form.typeHint')}
            testID="contact-form-type"
          />
        </StyledSection>

        <StyledSection>
          <Switch
            value={isPrimary}
            onValueChange={setIsPrimary}
            label={t('contact.form.primaryLabel')}
            accessibilityLabel={t('contact.form.primaryLabel')}
            accessibilityHint={t('contact.form.primaryHint')}
            testID="contact-form-primary"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('contact.form.cancel')}
            accessibilityHint={t('contact.form.cancelHint')}
            testID="contact-form-cancel"
          >
            {t('contact.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('contact.form.submitEdit') : t('contact.form.submitCreate')}
            testID="contact-form-submit"
          >
            {isEdit ? t('contact.form.submitEdit') : t('contact.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ContactFormScreenWeb;
