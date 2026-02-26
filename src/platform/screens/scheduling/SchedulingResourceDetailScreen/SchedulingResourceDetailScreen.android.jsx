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
} from './SchedulingResourceDetailScreen.android.styles';
import useSchedulingResourceDetailScreen from './useSchedulingResourceDetailScreen';

const SchedulingResourceDetailScreenAndroid = ({ resourceId }) => {
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
    onMarkReminderSent,
    onPrioritizeQueue,
    onToggleAvailability,
    onCreateAppointmentParticipant,
    onCreateAppointmentReminder,
    onCreateVisitQueue,
    canEdit,
    canDelete,
    canCancel,
    canMarkReminderSent,
    canPrioritizeQueue,
    canToggleAvailability,
    canCreateFromAppointment,
    editBlockedReason,
    deleteBlockedReason,
    cancelBlockedReason,
    markSentBlockedReason,
    prioritizeBlockedReason,
    toggleAvailabilityBlockedReason,
    createBlockedReason,
  } = useSchedulingResourceDetailScreen(resourceId);

  const rows = useMemo(() => config?.detailRows || [], [config?.detailRows]);

  if (!config) return null;

  if (isLoading && !item) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-resource-detail-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!isLoading && !item && hasError) {
    return (
      <StyledContainer>
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
      <StyledContainer>
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
    <StyledContainer>
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
            accessibilityLabel={t(`${config.i18nKey}.detail.edit`)}
            accessibilityHint={!canEdit ? editBlockedReason : t(`${config.i18nKey}.detail.editHint`)}
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
            accessibilityLabel={t(`${config.i18nKey}.detail.delete`)}
            accessibilityHint={!canDelete ? deleteBlockedReason : t(`${config.i18nKey}.detail.deleteHint`)}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="scheduling-resource-detail-delete"
          >
            {t(`${config.i18nKey}.detail.delete`)}
          </Button>

          {resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS ? (
            <>
              <Button
                variant="surface"
                size="small"
                onPress={onCancelAppointment}
                disabled={!canCancel}
                accessibilityLabel={t(`${config.i18nKey}.cancel.actionLabel`)}
                accessibilityHint={!canCancel ? cancelBlockedReason : t(`${config.i18nKey}.cancel.actionHint`)}
                icon={<Icon glyph="?" size="xs" decorative />}
                testID="scheduling-appointment-cancel"
              >
                {t(`${config.i18nKey}.cancel.actionLabel`)}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={onCreateAppointmentParticipant}
                disabled={!canCreateFromAppointment}
                accessibilityHint={!canCreateFromAppointment ? createBlockedReason : undefined}
                testID="scheduling-appointment-create-participant"
              >
                {t('scheduling.resources.appointments.detail.createParticipant')}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={onCreateAppointmentReminder}
                disabled={!canCreateFromAppointment}
                accessibilityHint={!canCreateFromAppointment ? createBlockedReason : undefined}
                testID="scheduling-appointment-create-reminder"
              >
                {t('scheduling.resources.appointments.detail.createReminder')}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={onCreateVisitQueue}
                disabled={!canCreateFromAppointment}
                accessibilityHint={!canCreateFromAppointment ? createBlockedReason : undefined}
                testID="scheduling-appointment-create-queue"
              >
                {t('scheduling.resources.appointments.detail.createQueue')}
              </Button>
            </>
          ) : null}

          {resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS ? (
            <Button
              variant="surface"
              size="small"
              onPress={onMarkReminderSent}
              disabled={!canMarkReminderSent}
              accessibilityHint={!canMarkReminderSent ? markSentBlockedReason : undefined}
              testID="scheduling-reminder-mark-sent"
            >
              {t('scheduling.resources.appointmentReminders.detail.markSent')}
            </Button>
          ) : null}

          {resourceId === SCHEDULING_RESOURCE_IDS.VISIT_QUEUES ? (
            <Button
              variant="surface"
              size="small"
              onPress={onPrioritizeQueue}
              disabled={!canPrioritizeQueue}
              accessibilityHint={!canPrioritizeQueue ? prioritizeBlockedReason : undefined}
              testID="scheduling-visit-queue-prioritize"
            >
              {t('scheduling.resources.visitQueues.detail.prioritize')}
            </Button>
          ) : null}

          {resourceId === SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS ? (
            <Button
              variant="surface"
              size="small"
              onPress={onToggleAvailability}
              disabled={!canToggleAvailability}
              accessibilityHint={!canToggleAvailability ? toggleAvailabilityBlockedReason : undefined}
              testID="scheduling-availability-toggle"
            >
              {item?.is_available !== false
                ? t('scheduling.resources.availabilitySlots.detail.markUnavailable')
                : t('scheduling.resources.availabilitySlots.detail.markAvailable')}
            </Button>
          ) : null}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default SchedulingResourceDetailScreenAndroid;
