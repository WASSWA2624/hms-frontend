/**
 * ContactFormScreen - Web
 */
import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
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
  StyledHelperStack,
  StyledInlineStates,
} from './ContactFormScreen.web.styles';
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
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    valueError,
    contactTypeError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    contact,
    onSubmit,
    onCancel,
    onGoToTenants,
    onRetryTenants,
    isSubmitDisabled,
  } = useContactFormScreen();

  if (isEdit && !contact && isLoading) {
    return (
      <StyledContainer role="main" aria-label={t('contact.form.editTitle')}>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="contact-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !contact) {
    return (
      <StyledContainer role="main" aria-label={t('contact.form.editTitle')}>
        <StyledContent>
          <ErrorState
            title={t('contact.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('contact.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="contact-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && isCreateBlocked);
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="contact-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(contact));
  const blockedMessage = t('contact.form.blockedMessage');
  const valueHelperText = valueError || (isCreateBlocked ? blockedMessage : t('contact.form.valueHint'));
  const typeHelperText = contactTypeError || (isCreateBlocked ? blockedMessage : t('contact.form.typeHint'));
  const tenantHelperText = tenantError || t('contact.form.tenantHint');
  const tenantLockedHint = isEdit ? t('contact.form.tenantLockedHint') : t('contact.form.tenantScopedHint');

  return (
    <StyledContainer role="main" aria-label={isEdit ? t('contact.form.editTitle') : t('contact.form.createTitle')}>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="contact-form-title">
          {isEdit ? t('contact.form.editTitle') : t('contact.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="contact-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('contact.form.submitErrorTitle')}
              description={errorMessage}
              testID="contact-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('contact.form.valueLabel')} testID="contact-form-card">
          <StyledFormGrid>
            {!isEdit && !isTenantLocked ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="contact-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('contact.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="contact-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('contact.form.tenantLabel')}
                      data-testid="contact-form-no-tenants"
                    >
                      <Text variant="body">{t('contact.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('contact.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('contact.form.goToTenants')}
                        accessibilityHint={t('contact.form.goToTenantsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="contact-form-go-to-tenants"
                      >
                        {t('contact.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('contact.form.tenantLabel')}
                      placeholder={t('contact.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('contact.form.tenantLabel')}
                      accessibilityHint={t('contact.form.tenantHint')}
                      errorMessage={tenantError}
                      helperText={tenantHelperText}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="contact-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('contact.form.tenantLabel')}
                    value={isEdit ? tenantId : lockedTenantDisplay}
                    accessibilityLabel={t('contact.form.tenantLabel')}
                    accessibilityHint={tenantLockedHint}
                    helperText={tenantLockedHint}
                    disabled
                    testID="contact-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('contact.form.valueLabel')}
                placeholder={t('contact.form.valuePlaceholder')}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                accessibilityLabel={t('contact.form.valueLabel')}
                accessibilityHint={t('contact.form.valueHint')}
                errorMessage={valueError}
                helperText={valueHelperText}
                required
                maxLength={255}
                density="compact"
                disabled={isFormDisabled}
                testID="contact-form-value"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Select
                label={t('contact.form.typeLabel')}
                placeholder={t('contact.form.typePlaceholder')}
                options={contactTypeOptions}
                value={contactType}
                onValueChange={setContactType}
                accessibilityLabel={t('contact.form.typeLabel')}
                accessibilityHint={t('contact.form.typeHint')}
                errorMessage={contactTypeError}
                helperText={typeHelperText}
                required
                compact
                disabled={isFormDisabled}
                testID="contact-form-type"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Switch
                value={isPrimary}
                onValueChange={setIsPrimary}
                label={t('contact.form.primaryLabel')}
                accessibilityLabel={t('contact.form.primaryLabel')}
                accessibilityHint={t('contact.form.primaryHint')}
                testID="contact-form-primary"
                disabled={isFormDisabled}
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('contact.form.cancel')}
            accessibilityHint={t('contact.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="contact-form-cancel"
            disabled={isLoading}
          >
            {t('contact.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('contact.form.submitEdit') : t('contact.form.submitCreate')}
            accessibilityHint={isEdit ? t('contact.form.submitEdit') : t('contact.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
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
