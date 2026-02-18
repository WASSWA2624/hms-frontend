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
    facilityId,
    setFacilityId,
    branchId,
    setBranchId,
    tenantOptions,
    facilityOptions,
    branchOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    branchListLoading,
    branchListError,
    branchErrorMessage,
    hasTenants,
    hasFacilities,
    hasBranches,
    isCreateBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    address,
    addressTypeError,
    line1Error,
    line2Error,
    cityError,
    stateError,
    postalCodeError,
    countryError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    tenantDisplayLabel,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onGoToBranches,
    onRetryTenants,
    onRetryFacilities,
    onRetryBranches,
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
  const retryFacilitiesAction = onRetryFacilities ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryFacilities}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="address-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryBranchesAction = onRetryBranches ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryBranches}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="address-form-branch-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const showInlineError = hasError && (!isEdit || Boolean(address));
  const blockedMessage = t('address.form.blockedMessage');
  const tenantHelperText = tenantError || t('address.form.tenantHint');
  const typeHelperText = addressTypeError || (isCreateBlocked ? blockedMessage : t('address.form.typeHint'));
  const line1HelperText = line1Error || (isCreateBlocked ? blockedMessage : t('address.form.line1Hint'));
  const line2HelperText = line2Error || t('address.form.line2Hint');
  const cityHelperText = cityError || t('address.form.cityHint');
  const stateHelperText = stateError || t('address.form.stateHint');
  const postalCodeHelperText = postalCodeError || t('address.form.postalCodeHint');
  const countryHelperText = countryError || t('address.form.countryHint');
  const facilityHelperText = !tenantId
    ? t('address.form.selectTenantFirst')
    : (hasFacilities ? t('address.form.facilityHint') : t('address.form.noFacilitiesMessage'));
  const branchHelperText = !tenantId
    ? t('address.form.selectTenantFirst')
    : (hasBranches ? t('address.form.branchHint') : t('address.form.noBranchesMessage'));

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
            {!isEdit && !isTenantLocked ? (
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
                      errorMessage={tenantError}
                      helperText={tenantHelperText}
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
                    value={tenantDisplayLabel || lockedTenantDisplay}
                    accessibilityLabel={t('address.form.tenantLabel')}
                    accessibilityHint={t('address.form.tenantLockedHint')}
                    helperText={t('address.form.tenantLockedHint')}
                    disabled
                    testID="address-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFullRow>
              <StyledFieldGroup>
                {facilityListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="address-form-facility-loading"
                  />
                ) : facilityListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('address.form.facilityLoadErrorTitle')}
                    description={facilityErrorMessage}
                    action={retryFacilitiesAction}
                    testID="address-form-facility-error"
                  />
                ) : (
                  <>
                    <Select
                      label={t('address.form.facilityLabel')}
                      placeholder={t('address.form.facilityPlaceholder')}
                      options={facilityOptions}
                      value={facilityId}
                      onValueChange={setFacilityId}
                      accessibilityLabel={t('address.form.facilityLabel')}
                      accessibilityHint={t('address.form.facilityHint')}
                      helperText={facilityHelperText}
                      compact
                      disabled={isFormDisabled || !tenantId}
                      testID="address-form-facility"
                    />
                    {tenantId && !hasFacilities && (
                      <StyledHelperStack>
                        <Button
                          variant="surface"
                          size="small"
                          onPress={onGoToFacilities}
                          accessibilityLabel={t('address.form.goToFacilities')}
                          accessibilityHint={t('address.form.goToFacilitiesHint')}
                          icon={<Icon glyph="?" size="xs" decorative />}
                          testID="address-form-go-to-facilities"
                        >
                          {t('address.form.goToFacilities')}
                        </Button>
                      </StyledHelperStack>
                    )}
                  </>
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFullRow>
              <StyledFieldGroup>
                {branchListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="address-form-branch-loading"
                  />
                ) : branchListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('address.form.branchLoadErrorTitle')}
                    description={branchErrorMessage}
                    action={retryBranchesAction}
                    testID="address-form-branch-error"
                  />
                ) : (
                  <>
                    <Select
                      label={t('address.form.branchLabel')}
                      placeholder={t('address.form.branchPlaceholder')}
                      options={branchOptions}
                      value={branchId}
                      onValueChange={setBranchId}
                      accessibilityLabel={t('address.form.branchLabel')}
                      accessibilityHint={t('address.form.branchHint')}
                      helperText={branchHelperText}
                      compact
                      disabled={isFormDisabled || !tenantId}
                      testID="address-form-branch"
                    />
                    {tenantId && !hasBranches && (
                      <StyledHelperStack>
                        <Button
                          variant="surface"
                          size="small"
                          onPress={onGoToBranches}
                          accessibilityLabel={t('address.form.goToBranches')}
                          accessibilityHint={t('address.form.goToBranchesHint')}
                          icon={<Icon glyph="?" size="xs" decorative />}
                          testID="address-form-go-to-branches"
                        >
                          {t('address.form.goToBranches')}
                        </Button>
                      </StyledHelperStack>
                    )}
                  </>
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFieldGroup>
              <Select
                label={t('address.form.typeLabel')}
                options={addressTypeOptions}
                value={addressType}
                onValueChange={setAddressType}
                placeholder={t('address.form.typePlaceholder')}
                accessibilityLabel={t('address.form.typeLabel')}
                accessibilityHint={t('address.form.typeHint')}
                errorMessage={addressTypeError}
                helperText={typeHelperText}
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
                errorMessage={line1Error}
                helperText={line1HelperText}
                required
                maxLength={255}
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
                errorMessage={line2Error}
                helperText={line2HelperText}
                maxLength={255}
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
                errorMessage={cityError}
                helperText={cityHelperText}
                maxLength={120}
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
                errorMessage={stateError}
                helperText={stateHelperText}
                maxLength={120}
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
                errorMessage={postalCodeError}
                helperText={postalCodeHelperText}
                maxLength={40}
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
                errorMessage={countryError}
                helperText={countryHelperText}
                maxLength={120}
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
