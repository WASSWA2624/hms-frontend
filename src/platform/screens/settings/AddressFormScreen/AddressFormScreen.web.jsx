/**
 * AddressFormScreen - Web
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './AddressFormScreen.web.styles';
import useAddressFormScreen from './useAddressFormScreen';

const AddressFormScreenWeb = () => {
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
    isLoading,
    hasError,
    address,
    onSubmit,
    onCancel,
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
            action={
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            }
            testID="address-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="address-form-title">
          {isEdit ? t('address.form.editTitle') : t('address.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('address.form.tenantIdLabel')}
              placeholder={t('address.form.tenantIdPlaceholder')}
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              accessibilityLabel={t('address.form.tenantIdLabel')}
              accessibilityHint={t('address.form.tenantIdHint')}
              testID="address-form-tenant-id"
            />
          </StyledSection>
        )}

        <StyledSection>
          <Select
            label={t('address.form.typeLabel')}
            options={addressTypeOptions}
            value={addressType}
            onValueChange={setAddressType}
            placeholder={t('address.form.typePlaceholder')}
            accessibilityLabel={t('address.form.typeLabel')}
            accessibilityHint={t('address.form.typeHint')}
            testID="address-form-type"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('address.form.line1Label')}
            placeholder={t('address.form.line1Placeholder')}
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            accessibilityLabel={t('address.form.line1Label')}
            accessibilityHint={t('address.form.line1Hint')}
            testID="address-form-line1"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('address.form.line2Label')}
            placeholder={t('address.form.line2Placeholder')}
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            accessibilityLabel={t('address.form.line2Label')}
            accessibilityHint={t('address.form.line2Hint')}
            testID="address-form-line2"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('address.form.cityLabel')}
            placeholder={t('address.form.cityPlaceholder')}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            accessibilityLabel={t('address.form.cityLabel')}
            accessibilityHint={t('address.form.cityHint')}
            testID="address-form-city"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('address.form.stateLabel')}
            placeholder={t('address.form.statePlaceholder')}
            value={stateValue}
            onChange={(e) => setStateValue(e.target.value)}
            accessibilityLabel={t('address.form.stateLabel')}
            accessibilityHint={t('address.form.stateHint')}
            testID="address-form-state"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('address.form.postalCodeLabel')}
            placeholder={t('address.form.postalCodePlaceholder')}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            accessibilityLabel={t('address.form.postalCodeLabel')}
            accessibilityHint={t('address.form.postalCodeHint')}
            testID="address-form-postal-code"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('address.form.countryLabel')}
            placeholder={t('address.form.countryPlaceholder')}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            accessibilityLabel={t('address.form.countryLabel')}
            accessibilityHint={t('address.form.countryHint')}
            testID="address-form-country"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('address.form.cancel')}
            accessibilityHint={t('address.form.cancelHint')}
            testID="address-form-cancel"
          >
            {t('address.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('address.form.submitEdit') : t('address.form.submitCreate')}
            testID="address-form-submit"
          >
            {isEdit ? t('address.form.submitEdit') : t('address.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressFormScreenWeb;
