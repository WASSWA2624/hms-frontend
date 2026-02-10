/**
 * AddressFormScreen - iOS
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
} from './AddressFormScreen.ios.styles';
import useAddressFormScreen from './useAddressFormScreen';

const AddressFormScreenIOS = () => {
  const { t } = useI18n();
  const {
    isEdit,
    addressType,
    setAddressType,
    addressTypeOptions,
    line1,
    setLine1,
    line2,
    setLine2,
    city,
    setCity,
    stateValue,
    setStateValue,
    postalCode,
    setPostalCode,
    country,
    setCountry,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    address,
    onSubmit,
    onCancel,
    onGoToTenants,
    onRetryTenants,
    isSubmitDisabled,
  } = useAddressFormScreen();

  if (isEdit && !address && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="address-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !address) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('address.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('address.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="address-form-load-error"
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
      testID="address-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(address));
  const blockedMessage = t('address.form.blockedMessage');

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="address-form-title">
          {isEdit ? t('address.form.editTitle') : t('address.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="address-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('address.form.submitErrorTitle')}
              description={errorMessage}
              testID="address-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('address.form.line1Label')} testID="address-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="address-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('address.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="address-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('address.form.tenantLabel')}
                      testID="address-form-no-tenants"
                    >
                      <Text variant="body">{t('address.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('address.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('address.form.goToTenants')}
                        accessibilityHint={t('address.form.goToTenantsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="address-form-go-to-tenants"
                      >
                        {t('address.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('address.form.tenantLabel')}
                      placeholder={t('address.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('address.form.tenantLabel')}
                      accessibilityHint={t('address.form.tenantHint')}
                      helperText={t('address.form.tenantHint')}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="address-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('address.form.tenantLabel')}
                    value={tenantId}
                    accessibilityLabel={t('address.form.tenantLabel')}
                    accessibilityHint={t('address.form.tenantLockedHint')}
                    helperText={t('address.form.tenantLockedHint')}
                    disabled
                    testID="address-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <Select
                label={t('address.form.typeLabel')}
                options={addressTypeOptions}
                value={addressType}
                onValueChange={setAddressType}
                placeholder={t('address.form.typePlaceholder')}
                accessibilityLabel={t('address.form.typeLabel')}
                accessibilityHint={t('address.form.typeHint')}
                helperText={isCreateBlocked ? blockedMessage : t('address.form.typeHint')}
                required
                compact
                disabled={isFormDisabled}
                testID="address-form-type"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('address.form.line1Label')}
                placeholder={t('address.form.line1Placeholder')}
                value={line1}
                onChangeText={setLine1}
                accessibilityLabel={t('address.form.line1Label')}
                accessibilityHint={t('address.form.line1Hint')}
                helperText={isCreateBlocked ? blockedMessage : t('address.form.line1Hint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="address-form-line1"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('address.form.line2Label')}
                placeholder={t('address.form.line2Placeholder')}
                value={line2}
                onChangeText={setLine2}
                accessibilityLabel={t('address.form.line2Label')}
                accessibilityHint={t('address.form.line2Hint')}
                helperText={t('address.form.line2Hint')}
                density="compact"
                disabled={isFormDisabled}
                testID="address-form-line2"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('address.form.cityLabel')}
                placeholder={t('address.form.cityPlaceholder')}
                value={city}
                onChangeText={setCity}
                accessibilityLabel={t('address.form.cityLabel')}
                accessibilityHint={t('address.form.cityHint')}
                helperText={t('address.form.cityHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="address-form-city"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('address.form.stateLabel')}
                placeholder={t('address.form.statePlaceholder')}
                value={stateValue}
                onChangeText={setStateValue}
                accessibilityLabel={t('address.form.stateLabel')}
                accessibilityHint={t('address.form.stateHint')}
                helperText={t('address.form.stateHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="address-form-state"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('address.form.postalCodeLabel')}
                placeholder={t('address.form.postalCodePlaceholder')}
                value={postalCode}
                onChangeText={setPostalCode}
                accessibilityLabel={t('address.form.postalCodeLabel')}
                accessibilityHint={t('address.form.postalCodeHint')}
                helperText={t('address.form.postalCodeHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="address-form-postal-code"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('address.form.countryLabel')}
                placeholder={t('address.form.countryPlaceholder')}
                value={country}
                onChangeText={setCountry}
                accessibilityLabel={t('address.form.countryLabel')}
                accessibilityHint={t('address.form.countryHint')}
                helperText={t('address.form.countryHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="address-form-country"
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('address.form.cancel')}
            accessibilityHint={t('address.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="address-form-cancel"
            disabled={isLoading}
          >
            {t('address.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('address.form.submitEdit') : t('address.form.submitCreate')}
            accessibilityHint={isEdit ? t('address.form.submitEdit') : t('address.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="address-form-submit"
          >
            {isEdit ? t('address.form.submitEdit') : t('address.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressFormScreenIOS;
