import React, { useMemo } from 'react';
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
import { formatFieldValue } from '../schedulingScreenUtils';
import { SCHEDULING_RESOURCE_IDS } from '../schedulingResourceConfigs';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailsGrid,
  StyledField,
  StyledFieldLabel,
  StyledFieldValue,
  StyledInlineStates,
} from './SchedulingResourceDetailScreen.web.styles';
import useSchedulingResourceDetailScreen from './useSchedulingResourceDetailScreen';

const SchedulingResourceDetailScreenWeb = ({ resourceId }) => {
  const { t, locale } = useI18n();
  const {
    config,
    item,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
    onCancelAppointment,
    canEdit,
    canDelete,
    canCancel,
    editBlockedReason,
    deleteBlockedReason,
    cancelBlockedReason,
  } = useSchedulingResourceDetailScreen(resourceId);

  const rows = useMemo(() => config?.detailRows || [], [config?.detailRows]);

  if (!config) return null;

  if (isLoading && !item) {
    return (
      <StyledContainer role="main" aria-label={t(`${config.i18nKey}.detail.title`)}>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-resource-detail-loading" />
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
            testID="scheduling-resource-detail-error"
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
            testID="scheduling-resource-detail-empty"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer role="main" aria-label={t(`${config.i18nKey}.detail.title`)}>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="scheduling-resource-detail-title">
          {t(`${config.i18nKey}.detail.title`)}
        </Text>

        <StyledInlineStates>
          {isOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="scheduling-resource-detail-offline"
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
              testID="scheduling-resource-detail-inline-error"
            />
          ) : null}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t(`${config.i18nKey}.detail.title`)} testID="scheduling-resource-detail-card">
          <StyledDetailsGrid>
            {rows.map((row) => {
              const rawValue = item?.[row.valueKey];
              const value = formatFieldValue(rawValue, row.type, locale, formatDateTime, t);

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
            testID="scheduling-resource-detail-back"
          >
            {t('common.back')}
          </Button>

          <Button
            variant="surface"
            size="small"
            onPress={onEdit}
            disabled={!canEdit}
            aria-disabled={!canEdit}
            title={!canEdit ? editBlockedReason : undefined}
            accessibilityLabel={t(`${config.i18nKey}.detail.edit`)}
            accessibilityHint={t(`${config.i18nKey}.detail.editHint`)}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="scheduling-resource-detail-edit"
          >
            {t(`${config.i18nKey}.detail.edit`)}
          </Button>

          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            disabled={!canDelete}
            aria-disabled={!canDelete}
            title={!canDelete ? deleteBlockedReason : undefined}
            accessibilityLabel={t(`${config.i18nKey}.detail.delete`)}
            accessibilityHint={t(`${config.i18nKey}.detail.deleteHint`)}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="scheduling-resource-detail-delete"
          >
            {t(`${config.i18nKey}.detail.delete`)}
          </Button>

          {resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS ? (
            <Button
              variant="surface"
              size="small"
              onPress={onCancelAppointment}
              disabled={!canCancel}
              aria-disabled={!canCancel}
              title={!canCancel ? cancelBlockedReason : undefined}
              accessibilityLabel={t(`${config.i18nKey}.cancel.actionLabel`)}
              accessibilityHint={t(`${config.i18nKey}.cancel.actionHint`)}
              icon={<Icon glyph="?" size="xs" decorative />}
              testID="scheduling-appointment-cancel"
            >
              {t(`${config.i18nKey}.cancel.actionLabel`)}
            </Button>
          ) : null}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default SchedulingResourceDetailScreenWeb;


