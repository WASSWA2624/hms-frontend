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
import { formatDateTime } from '@utils';
import { formatFieldValue } from '../patientScreenUtils';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailsGrid,
  StyledField,
  StyledFieldLabel,
  StyledFieldValue,
  StyledInlineStates,
} from './PatientResourceDetailScreen.web.styles';
import usePatientResourceDetailScreen from './usePatientResourceDetailScreen';

const PatientResourceDetailScreenWeb = ({ resourceId }) => {
  const { t, locale } = useI18n();
  const {
    config,
    item,
    detailRows,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
    showEditAction,
  } = usePatientResourceDetailScreen(resourceId);

  if (!config) return null;

  if (isLoading && !item) {
    return (
      <StyledContainer role="main" aria-label={t(`${config.i18nKey}.detail.title`)}>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-resource-detail-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!isLoading && !item && hasError) {
    return (
      <StyledContainer role="main" aria-label={t(`${config.i18nKey}.detail.title`)}>
        <StyledContent>
          <ErrorState
            title={t(`${config.i18nKey}.detail.errorTitle`)}
            description={errorMessage}
            action={
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
            }
            testID="patient-resource-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!isLoading && !item) {
    return (
      <StyledContainer role="main" aria-label={t(`${config.i18nKey}.detail.title`)}>
        <StyledContent>
          <EmptyState
            title={t(`${config.i18nKey}.detail.notFoundTitle`)}
            description={t(`${config.i18nKey}.detail.notFoundMessage`)}
            action={
              <Button
                variant="surface"
                size="small"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t(`${config.i18nKey}.detail.backHint`)}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            }
            testID="patient-resource-detail-empty"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer role="main" aria-label={t(`${config.i18nKey}.detail.title`)}>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="patient-resource-detail-title">
          {t(`${config.i18nKey}.detail.title`)}
        </Text>

        <StyledInlineStates>
          {isOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="patient-resource-detail-offline"
            />
          ) : null}

          {hasError && item ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t(`${config.i18nKey}.detail.errorTitle`)}
              description={errorMessage}
              action={
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
              }
              testID="patient-resource-detail-inline-error"
            />
          ) : null}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t(`${config.i18nKey}.detail.title`)} testID="patient-resource-detail-card">
          <StyledDetailsGrid>
            {detailRows.map((row) => {
              const rawValue = item?.[row.valueKey];
              const value = row.type === 'boolean'
                ? rawValue ? t('common.on') : t('common.off')
                : formatFieldValue(rawValue, row.type, locale, formatDateTime);

              return (
                <StyledField key={row.valueKey}>
                  <StyledFieldLabel>{t(row.labelKey)}</StyledFieldLabel>
                  <StyledFieldValue>{value || '-'}</StyledFieldValue>
                </StyledField>
              );
            })}
          </StyledDetailsGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onBack}
            accessibilityLabel={t('common.back')}
            accessibilityHint={t(`${config.i18nKey}.detail.backHint`)}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="patient-resource-detail-back"
          >
            {t('common.back')}
          </Button>

          {showEditAction && canEdit ? (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t(`${config.i18nKey}.detail.edit`)}
              accessibilityHint={t(`${config.i18nKey}.detail.editHint`)}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="patient-resource-detail-edit"
            >
              {t(`${config.i18nKey}.detail.edit`)}
            </Button>
          ) : null}

          {canDelete ? (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              accessibilityLabel={t(`${config.i18nKey}.detail.delete`)}
              accessibilityHint={t(`${config.i18nKey}.detail.deleteHint`)}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="patient-resource-detail-delete"
            >
              {t(`${config.i18nKey}.detail.delete`)}
            </Button>
          ) : null}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default PatientResourceDetailScreenWeb;
