/**
 * AddressDetailScreen - Android
 * File: AddressDetailScreen.android.jsx
 */
import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime, humanizeIdentifier } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './AddressDetailScreen.android.styles';
import useAddressDetailScreen from './useAddressDetailScreen';

const AddressDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    address,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useAddressDetailScreen();

  const hasAddress = Boolean(address);

  if (isLoading && !hasAddress) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="address-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasAddress) {
    return (
      <StyledContainer>
        <StyledContent>
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="address-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasAddress) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('address.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="address-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!address) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('address.detail.notFoundTitle')}
            description={t('address.detail.notFoundMessage')}
            testID="address-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('address.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="address-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(address.created_at, locale);
  const updatedAt = formatDateTime(address.updated_at, locale);
  const line1 = address?.line1 ?? '';
  const line2 = address?.line2 ?? '';
  const city = address?.city ?? '';
  const state = address?.state ?? '';
  const postalCode = address?.postal_code ?? '';
  const country = address?.country ?? '';
  const addressType = address?.address_type ?? '';
  const typeLabel = addressType ? t(`address.types.${addressType}`) : '';
  const displayType = typeLabel && typeLabel !== `address.types.${addressType}` ? typeLabel : addressType;
  const tenantLabel = humanizeIdentifier(
    address?.tenant_name
    ?? address?.tenant?.name
    ?? address?.tenant_label
  );
  const facilityLabel = humanizeIdentifier(
    address?.facility_name
    ?? address?.facility?.name
    ?? address?.facility_label
  );
  const branchLabel = humanizeIdentifier(
    address?.branch_name
    ?? address?.branch?.name
    ?? address?.branch_label
  );
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasAddress && hasError;
  const showInlineOffline = hasAddress && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('address.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="address-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="address-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('address.detail.title')} testID="address-detail-card">
          <StyledDetailGrid>
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.tenantLabel')}</Text>
                <Text variant="body" testID="address-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.facilityLabel')}</Text>
                <Text variant="body" testID="address-detail-facility">
                  {facilityLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {branchLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.branchLabel')}</Text>
                <Text variant="body" testID="address-detail-branch">
                  {branchLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {addressType ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.typeLabel')}</Text>
                <Text variant="body" testID="address-detail-type">
                  {displayType}
                </Text>
              </StyledDetailItem>
            ) : null}
            {line1 ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.line1Label')}</Text>
                <Text variant="body" testID="address-detail-line1">
                  {line1}
                </Text>
              </StyledDetailItem>
            ) : null}
            {line2 ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.line2Label')}</Text>
                <Text variant="body" testID="address-detail-line2">
                  {line2}
                </Text>
              </StyledDetailItem>
            ) : null}
            {city ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.cityLabel')}</Text>
                <Text variant="body" testID="address-detail-city">
                  {city}
                </Text>
              </StyledDetailItem>
            ) : null}
            {state ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.stateLabel')}</Text>
                <Text variant="body" testID="address-detail-state">
                  {state}
                </Text>
              </StyledDetailItem>
            ) : null}
            {postalCode ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.postalCodeLabel')}</Text>
                <Text variant="body" testID="address-detail-postalCode">
                  {postalCode}
                </Text>
              </StyledDetailItem>
            ) : null}
            {country ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.countryLabel')}</Text>
                <Text variant="body" testID="address-detail-country">
                  {country}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.createdLabel')}</Text>
                <Text variant="body" testID="address-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('address.detail.updatedLabel')}</Text>
                <Text variant="body" testID="address-detail-updated">
                  {updatedAt}
                </Text>
              </StyledDetailItem>
            ) : null}
          </StyledDetailGrid>
        </Card>
        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onBack}
            accessibilityLabel={t('common.back')}
            accessibilityHint={t('address.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="address-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('address.detail.edit')}
              accessibilityHint={t('address.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="address-detail-edit"
              disabled={isLoading}
            >
              {t('address.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('address.detail.delete')}
              accessibilityHint={t('address.detail.deleteHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="address-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressDetailScreenAndroid;
