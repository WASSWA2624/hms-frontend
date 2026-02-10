/**
 * UserFormScreen - Web
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
} from './UserFormScreen.web.styles';
import useUserFormScreen from './useUserFormScreen';

const UserFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    status,
    setStatus,
    statusOptions,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    hasTenants,
    isCreateBlocked,
    showFacilityEmpty,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    user,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onRetryTenants,
    onRetryFacilities,
    isSubmitDisabled,
  } = useUserFormScreen();

  if (isEdit && !user && isLoading) {
    return (
      <StyledContainer role="main" aria-label={t('user.form.editTitle')}>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !user) {
    return (
      <StyledContainer role="main" aria-label={t('user.form.editTitle')}>
        <StyledContent>
          <ErrorState
            title={t('user.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('user.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="user-form-load-error"
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
      testID="user-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryFacilitiesAction = onRetryFacilities ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryFacilities}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="user-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(user));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const blockedMessage = t('user.form.blockedMessage');

  return (
    <StyledContainer role="main" aria-label={isEdit ? t('user.form.editTitle') : t('user.form.createTitle')}>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="user-form-title">
          {isEdit ? t('user.form.editTitle') : t('user.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="user-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('user.form.submitErrorTitle')}
              description={errorMessage}
              testID="user-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('user.form.emailLabel')} testID="user-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="user-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('user.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="user-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('user.form.tenantLabel')}
                      data-testid="user-form-no-tenants"
                    >
                      <Text variant="body">{t('user.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('user.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('user.form.goToTenants')}
                        accessibilityHint={t('user.form.goToTenantsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="user-form-go-to-tenants"
                      >
                        {t('user.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('user.form.tenantLabel')}
                      placeholder={t('user.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('user.form.tenantLabel')}
                      accessibilityHint={t('user.form.tenantHint')}
                      helperText={t('user.form.tenantHint')}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="user-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('user.form.tenantLabel')}
                    value={tenantId}
                    accessibilityLabel={t('user.form.tenantLabel')}
                    accessibilityHint={t('user.form.tenantLockedHint')}
                    helperText={t('user.form.tenantLockedHint')}
                    disabled
                    testID="user-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              {facilityListLoading ? (
                <LoadingSpinner
                  accessibilityLabel={t('common.loading')}
                  testID="user-form-facility-loading"
                />
              ) : facilityListError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('user.form.facilityLoadErrorTitle')}
                  description={facilityErrorMessage}
                  action={retryFacilitiesAction}
                  testID="user-form-facility-error"
                />
              ) : !tenantId && !isEdit ? (
                <Select
                  label={t('user.form.facilityLabel')}
                  placeholder={t('user.form.facilityPlaceholder')}
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                  accessibilityLabel={t('user.form.facilityLabel')}
                  accessibilityHint={t('user.form.selectTenantFirst')}
                  helperText={t('user.form.selectTenantFirst')}
                  compact
                  disabled
                  testID="user-form-select-tenant"
                />
              ) : showFacilityEmpty ? (
                <StyledHelperStack
                  role="region"
                  aria-label={t('user.form.facilityLabel')}
                  data-testid="user-form-no-facilities"
                >
                  <Text variant="body">{t('user.form.noFacilitiesMessage')}</Text>
                  <Text variant="body">{t('user.form.createFacilityRequired')}</Text>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onGoToFacilities}
                    accessibilityLabel={t('user.form.goToFacilities')}
                    accessibilityHint={t('user.form.goToFacilitiesHint')}
                    icon={<Icon glyph="?" size="xs" decorative />}
                    testID="user-form-go-to-facilities"
                  >
                    {t('user.form.goToFacilities')}
                  </Button>
                </StyledHelperStack>
              ) : (
                <Select
                  label={t('user.form.facilityLabel')}
                  placeholder={t('user.form.facilityPlaceholder')}
                  options={facilityOptions}
                  value={facilityId}
                  onValueChange={setFacilityId}
                  accessibilityLabel={t('user.form.facilityLabel')}
                  accessibilityHint={t('user.form.facilityHint')}
                  helperText={t('user.form.facilityHint')}
                  compact
                  disabled={isFormDisabled}
                  testID="user-form-facility"
                />
              )}
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('user.form.emailLabel')}
                placeholder={t('user.form.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                accessibilityLabel={t('user.form.emailLabel')}
                accessibilityHint={t('user.form.emailHint')}
                helperText={showTenantBlocked ? blockedMessage : t('user.form.emailHint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="user-form-email"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('user.form.phoneLabel')}
                placeholder={t('user.form.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                accessibilityLabel={t('user.form.phoneLabel')}
                accessibilityHint={t('user.form.phoneHint')}
                helperText={t('user.form.phoneHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="user-form-phone"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('user.form.passwordLabel')}
                placeholder={t('user.form.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                accessibilityLabel={t('user.form.passwordLabel')}
                accessibilityHint={isEdit ? t('user.form.passwordEditHint') : t('user.form.passwordHint')}
                helperText={isEdit ? t('user.form.passwordEditHint') : t('user.form.passwordHint')}
                required={!isEdit}
                density="compact"
                disabled={isFormDisabled}
                testID="user-form-password"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Select
                label={t('user.form.statusLabel')}
                placeholder={t('user.form.statusPlaceholder')}
                options={statusOptions}
                value={status}
                onValueChange={setStatus}
                accessibilityLabel={t('user.form.statusLabel')}
                accessibilityHint={t('user.form.statusHint')}
                helperText={t('user.form.statusHint')}
                required
                compact
                disabled={isFormDisabled}
                testID="user-form-status"
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('user.form.cancel')}
            accessibilityHint={t('user.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="user-form-cancel"
            disabled={isLoading}
          >
            {t('user.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('user.form.submitEdit') : t('user.form.submitCreate')}
            accessibilityHint={isEdit ? t('user.form.submitEdit') : t('user.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="user-form-submit"
          >
            {isEdit ? t('user.form.submitEdit') : t('user.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserFormScreenWeb;
