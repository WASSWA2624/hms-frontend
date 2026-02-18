/**
 * ContactDetailScreen - iOS
 * File: ContactDetailScreen.ios.jsx
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
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './ContactDetailScreen.ios.styles';
import useContactDetailScreen from './useContactDetailScreen';

const resolveContactTypeLabel = (t, value) => {
  if (!value) return '';
  const key = `contact.types.${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return String(normalized).trim();
  }
  return '';
};

const resolveContextValue = (readableValue, technicalId, canViewTechnicalIds) => {
  if (readableValue) return readableValue;
  if (canViewTechnicalIds) return String(technicalId ?? '').trim();
  return '';
};

const ContactDetailScreenIOS = () => {
  const { t, locale } = useI18n();
  const {
    contact,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useContactDetailScreen();

  const hasContact = Boolean(contact);

  if (isLoading && !hasContact) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="contact-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasContact) {
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
            testID="contact-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasContact) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('contact.detail.errorTitle')}
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
            testID="contact-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!contact) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('contact.detail.notFoundTitle')}
            description={t('contact.detail.notFoundMessage')}
            testID="contact-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('contact.detail.backHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="contact-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(contact.created_at, locale);
  const updatedAt = formatDateTime(contact.updated_at, locale);
  const value = contact?.value ?? '';
  const contactType = contact?.contact_type ?? '';
  const contactTypeLabel = resolveContactTypeLabel(t, contactType);
  const displayType = contactTypeLabel || contactType;
  const isPrimary = contact?.is_primary ?? false;
  const tenantLabel = resolveContextValue(
    resolveReadableValue(contact?.tenant_name, contact?.tenant?.name, contact?.tenant_label),
    contact?.tenant_id,
    canViewTechnicalIds
  );
  const facilityLabel = resolveContextValue(
    resolveReadableValue(contact?.facility_name, contact?.facility?.name, contact?.facility_label),
    contact?.facility_id,
    canViewTechnicalIds
  );
  const branchLabel = resolveContextValue(
    resolveReadableValue(contact?.branch_name, contact?.branch?.name, contact?.branch_label),
    contact?.branch_id,
    canViewTechnicalIds
  );
  const patientLabel = resolveContextValue(
    resolveReadableValue(
      contact?.patient_name,
      contact?.patient_full_name,
      contact?.patient?.full_name,
      contact?.patient?.name,
      contact?.patient_label
    ),
    contact?.patient_id,
    canViewTechnicalIds
  );
  const userProfileLabel = resolveContextValue(
    resolveReadableValue(
      contact?.user_profile_name,
      contact?.user_profile_full_name,
      contact?.user_profile?.full_name,
      contact?.user_profile?.name,
      contact?.user_profile_label
    ),
    contact?.user_profile_id,
    canViewTechnicalIds
  );
  const staffProfileLabel = resolveContextValue(
    resolveReadableValue(
      contact?.staff_profile_name,
      contact?.staff_profile_full_name,
      contact?.staff_profile?.full_name,
      contact?.staff_profile?.name,
      contact?.staff_profile_label
    ),
    contact?.staff_profile_id,
    canViewTechnicalIds
  );
  const supplierLabel = resolveContextValue(
    resolveReadableValue(contact?.supplier_name, contact?.supplier?.name, contact?.supplier_label),
    contact?.supplier_id,
    canViewTechnicalIds
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
  const showInlineError = hasContact && hasError;
  const showInlineOffline = hasContact && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('contact.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="contact-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="contact-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('contact.detail.title')} testID="contact-detail-card">
          <StyledDetailGrid>
            {canViewTechnicalIds ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.idLabel')}</Text>
                <Text variant="body" testID="contact-detail-id">
                  {contact.id}
                </Text>
              </StyledDetailItem>
            ) : null}
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.tenantLabel')}</Text>
                <Text variant="body" testID="contact-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.facilityLabel')}</Text>
                <Text variant="body" testID="contact-detail-facility">
                  {facilityLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {branchLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.branchLabel')}</Text>
                <Text variant="body" testID="contact-detail-branch">
                  {branchLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {patientLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.patientLabel')}</Text>
                <Text variant="body" testID="contact-detail-patient">
                  {patientLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {userProfileLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.userProfileLabel')}</Text>
                <Text variant="body" testID="contact-detail-user-profile">
                  {userProfileLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {staffProfileLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.staffProfileLabel')}</Text>
                <Text variant="body" testID="contact-detail-staff-profile">
                  {staffProfileLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {supplierLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.supplierLabel')}</Text>
                <Text variant="body" testID="contact-detail-supplier">
                  {supplierLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {value ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.valueLabel')}</Text>
                <Text variant="body" testID="contact-detail-value">
                  {value}
                </Text>
              </StyledDetailItem>
            ) : null}
            {displayType ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.typeLabel')}</Text>
                <Text variant="body" testID="contact-detail-type">
                  {displayType}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('contact.detail.primaryLabel')}</Text>
              <Text variant="body" testID="contact-detail-primary">
                {isPrimary ? t('common.on') : t('common.off')}
              </Text>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.createdLabel')}</Text>
                <Text variant="body" testID="contact-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('contact.detail.updatedLabel')}</Text>
                <Text variant="body" testID="contact-detail-updated">
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
            accessibilityHint={t('contact.detail.backHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="contact-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('contact.detail.edit')}
              accessibilityHint={t('contact.detail.editHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="contact-detail-edit"
              disabled={isLoading}
            >
              {t('contact.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('contact.detail.delete')}
              accessibilityHint={t('contact.detail.deleteHint')}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="contact-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default ContactDetailScreenIOS;
