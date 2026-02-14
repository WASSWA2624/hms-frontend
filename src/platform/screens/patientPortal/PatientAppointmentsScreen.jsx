import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Button,
  Card,
  Container,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Snackbar,
  Stack,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import { useAppointment, useAppointmentReminder, useI18n, useNetwork } from '@hooks';
import { formatDateTime } from '@utils';
import {
  APPOINTMENT_STATUS_VALUES,
  normalizeList,
  resolveEnumLabel,
  toDateTimeInputValue,
  toIsoDateTime,
  usePatientPortalScope,
} from './shared';

const FORM_MODE = {
  CREATE: 'create',
  EDIT: 'edit',
};

const defaultFormValues = {
  scheduled_start: '',
  scheduled_end: '',
  reason: '',
  status: 'SCHEDULED',
};

const buildListParams = ({ patientId, tenantId, facilityId, status }) => {
  const params = {
    page: 1,
    limit: 50,
    patient_id: patientId,
  };
  if (tenantId) params.tenant_id = tenantId;
  if (facilityId) params.facility_id = facilityId;
  if (status && status !== 'ALL') params.status = status;
  return params;
};

const toAppointmentFormValues = (appointment) => ({
  scheduled_start: toDateTimeInputValue(appointment?.scheduled_start),
  scheduled_end: toDateTimeInputValue(appointment?.scheduled_end),
  reason: String(appointment?.reason || ''),
  status: String(appointment?.status || 'SCHEDULED'),
});

const validateAppointmentForm = (values, t) => {
  const errors = {};
  const startIso = toIsoDateTime(values.scheduled_start);
  const endIso = toIsoDateTime(values.scheduled_end);

  if (!startIso) errors.scheduled_start = t('patientPortal.appointments.form.startInvalid');
  if (!endIso) errors.scheduled_end = t('patientPortal.appointments.form.endInvalid');

  if (startIso && endIso && new Date(startIso).getTime() > new Date(endIso).getTime()) {
    errors.scheduled_end = t('patientPortal.validation.startBeforeEnd');
  }

  if (!APPOINTMENT_STATUS_VALUES.includes(String(values.status || '').toUpperCase())) {
    errors.status = t('patientPortal.appointments.form.statusInvalid');
  }

  return { errors, startIso, endIso };
};

const PatientAppointmentsScreen = () => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const scope = usePatientPortalScope();
  const toScopedPath = scope.toScopedPath;
  const appointmentListApi = useAppointment();
  const appointmentDetailApi = useAppointment();
  const appointmentActionApi = useAppointment();
  const reminderListApi = useAppointmentReminder();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [notice, setNotice] = useState(null);

  const canWriteAppointments = scope.canManageAppointments && Boolean(scope.effectiveTenantId);
  const writeBlockedReason = scope.canManageAppointments
    ? t('patientPortal.appointments.tenantRequired')
    : t('patientPortal.appointments.writeBlocked');

  const statusOptions = useMemo(
    () => [
      { label: t('patientPortal.filters.allStatuses'), value: 'ALL' },
      ...APPOINTMENT_STATUS_VALUES.map((status) => ({
        label: resolveEnumLabel(t, 'patientPortal.appointments.status', status),
        value: status,
      })),
    ],
    [t]
  );

  const loadAppointments = useCallback(async () => {
    if (!scope.isScopeReady) return;
    setIsRefreshing(true);
    appointmentListApi.reset();
    await appointmentListApi.list(
      buildListParams({
        patientId: scope.effectivePatientId,
        tenantId: scope.effectiveTenantId,
        facilityId: scope.effectiveFacilityId,
        status: filterStatus,
      })
    );
    setIsRefreshing(false);
  }, [
    appointmentListApi,
    filterStatus,
    scope.effectiveFacilityId,
    scope.effectivePatientId,
    scope.effectiveTenantId,
    scope.isScopeReady,
  ]);

  useEffect(() => {
    if (!scope.isScopeReady) return;
    loadAppointments();
  }, [loadAppointments, scope.isScopeReady]);

  const appointments = useMemo(
    () =>
      normalizeList(appointmentListApi.data)
        .filter((appointment) => {
          const patientId = String(appointment?.patient_id || '').trim();
          return patientId === scope.effectivePatientId;
        })
        .sort((left, right) => {
          const leftTime = new Date(left?.scheduled_start || left?.scheduled_end || 0).getTime();
          const rightTime = new Date(right?.scheduled_start || right?.scheduled_end || 0).getTime();
          return rightTime - leftTime;
        }),
    [appointmentListApi.data, scope.effectivePatientId]
  );

  const selectedAppointment = useMemo(() => {
    if (!selectedAppointmentId) return null;
    const detailRecord = appointmentDetailApi.data;
    if (
      detailRecord &&
      typeof detailRecord === 'object' &&
      !Array.isArray(detailRecord) &&
      String(detailRecord?.id || '') === String(selectedAppointmentId)
    ) {
      return detailRecord;
    }
    return appointments.find(
      (appointment) => String(appointment?.id || '') === String(selectedAppointmentId)
    ) || null;
  }, [appointmentDetailApi.data, appointments, selectedAppointmentId]);

  const reminders = useMemo(() => normalizeList(reminderListApi.data), [reminderListApi.data]);

  const loadAppointmentDetail = useCallback(
    async (appointmentId) => {
      if (!appointmentId) return;
      setSelectedAppointmentId(appointmentId);
      appointmentDetailApi.reset();
      reminderListApi.reset();

      const detail = await appointmentDetailApi.get(appointmentId);
      if (!detail || typeof detail !== 'object') return;
      const recordPatientId = String(detail?.patient_id || '').trim();
      if (recordPatientId !== scope.effectivePatientId) {
        setSelectedAppointmentId(null);
        setNotice({
          variant: 'error',
          message: t('patientPortal.common.accessDenied'),
        });
        return;
      }

      await reminderListApi.list({
        page: 1,
        limit: 20,
        appointment_id: appointmentId,
      });
    },
    [
      appointmentDetailApi,
      reminderListApi,
      scope.effectivePatientId,
      t,
    ]
  );

  const handleOpenCreate = useCallback(() => {
    setFormMode(FORM_MODE.CREATE);
    setFormValues({
      ...defaultFormValues,
      status: 'SCHEDULED',
    });
    setFormErrors({});
  }, []);

  const handleOpenEdit = useCallback(
    (appointment) => {
      if (!appointment) return;
      setSelectedAppointmentId(String(appointment.id));
      setFormMode(FORM_MODE.EDIT);
      setFormValues(toAppointmentFormValues(appointment));
      setFormErrors({});
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!canWriteAppointments) {
      setNotice({
        variant: 'error',
        message: writeBlockedReason,
      });
      return;
    }

    const { errors, startIso, endIso } = validateAppointmentForm(formValues, t);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const basePayload = {
      scheduled_start: startIso,
      scheduled_end: endIso,
      reason: String(formValues.reason || '').trim() || null,
      status: String(formValues.status || 'SCHEDULED').toUpperCase(),
    };

    if (formMode === FORM_MODE.EDIT) {
      if (!selectedAppointmentId) return;
      const existingRecord = appointments.find(
        (appointment) => String(appointment?.id || '') === String(selectedAppointmentId)
      );
      if (
        existingRecord &&
        String(existingRecord?.patient_id || '').trim() !== scope.effectivePatientId
      ) {
        setNotice({
          variant: 'error',
          message: t('patientPortal.common.accessDenied'),
        });
        return;
      }
      const updated = await appointmentActionApi.update(selectedAppointmentId, basePayload);
      if (!updated) {
        setNotice({
          variant: 'error',
          message: t('patientPortal.appointments.saveError'),
        });
        return;
      }
    } else {
      const created = await appointmentActionApi.create({
        tenant_id: scope.effectiveTenantId,
        facility_id: scope.effectiveFacilityId || null,
        patient_id: scope.effectivePatientId,
        ...basePayload,
      });
      if (!created) {
        setNotice({
          variant: 'error',
          message: t('patientPortal.appointments.saveError'),
        });
        return;
      }
    }

    setNotice({
      variant: 'success',
      message: isOffline
        ? t('patientPortal.common.queuedNotice')
        : t(
            formMode === FORM_MODE.EDIT
              ? 'patientPortal.appointments.updatedNotice'
              : 'patientPortal.appointments.createdNotice'
          ),
    });

    setFormMode(null);
    setFormValues(defaultFormValues);
    await loadAppointments();
    if (selectedAppointmentId) {
      await loadAppointmentDetail(selectedAppointmentId);
    }
  }, [
    appointmentActionApi,
    appointments,
    canWriteAppointments,
    formMode,
    formValues,
    isOffline,
    loadAppointmentDetail,
    loadAppointments,
    scope.effectiveFacilityId,
    scope.effectivePatientId,
    scope.effectiveTenantId,
    selectedAppointmentId,
    t,
    writeBlockedReason,
  ]);

  const handleCancelAppointment = useCallback(
    async (appointment) => {
      if (!appointment || !canWriteAppointments) return;
      const appointmentId = String(appointment?.id || '').trim();
      if (!appointmentId) return;
      const patientId = String(appointment?.patient_id || '').trim();
      if (patientId !== scope.effectivePatientId) {
        setNotice({
          variant: 'error',
          message: t('patientPortal.common.accessDenied'),
        });
        return;
      }

      const cancelled = await appointmentActionApi.cancel(appointmentId, {});
      if (!cancelled) {
        setNotice({
          variant: 'error',
          message: t('patientPortal.appointments.cancelError'),
        });
        return;
      }

      setNotice({
        variant: 'success',
        message: isOffline
          ? t('patientPortal.common.queuedNotice')
          : t('patientPortal.appointments.cancelledNotice'),
      });

      await loadAppointments();
      if (selectedAppointmentId && selectedAppointmentId === appointmentId) {
        await loadAppointmentDetail(appointmentId);
      }
    },
    [
      appointmentActionApi,
      canWriteAppointments,
      isOffline,
      loadAppointmentDetail,
      loadAppointments,
      scope.effectivePatientId,
      selectedAppointmentId,
      t,
    ]
  );

  const hasError = Boolean(
    appointmentListApi.errorCode ||
      appointmentDetailApi.errorCode ||
      reminderListApi.errorCode
  );
  const isLoading =
    !scope.isScopeReady ||
    isRefreshing ||
    appointmentListApi.isLoading ||
    appointmentDetailApi.isLoading ||
    reminderListApi.isLoading;

  if (!scope.isScopeReady) {
    return (
      <Container size="medium" testID="patient-appointments-loading">
        <LoadingSpinner accessibilityLabel={t('common.loading')} />
      </Container>
    );
  }

  return (
    <Container size="medium" testID="patient-appointments-screen">
      <Stack spacing="md">
        {notice ? (
          <Snackbar
            visible={Boolean(notice?.message)}
            message={notice?.message || ''}
            variant={notice?.variant || 'info'}
            position="bottom"
            onDismiss={() => setNotice(null)}
            testID="patient-appointments-notice"
          />
        ) : null}

        <Stack spacing="xs">
          <Text variant="h3">{t('patientPortal.appointments.title')}</Text>
          <Text variant="body">{t('patientPortal.appointments.description')}</Text>
        </Stack>

        <Button
          variant="surface"
          size="small"
          onPress={() => router.push(toScopedPath('/portal'))}
          accessibilityLabel={t('patientPortal.common.backToPortal')}
          accessibilityHint={t('patientPortal.common.backToPortalHint')}
          testID="patient-appointments-back"
        >
          {t('patientPortal.common.backToPortal')}
        </Button>

        {isOffline ? (
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('patientPortal.appointments.offlineMessage')}
            testID="patient-appointments-offline"
          />
        ) : null}

        {hasError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('patientPortal.appointments.loadErrorTitle')}
            description={t('patientPortal.appointments.loadErrorMessage')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={loadAppointments}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                testID="patient-appointments-retry"
              >
                {t('common.retry')}
              </Button>
            )}
            testID="patient-appointments-error"
          />
        ) : null}

        <Card accessibilityLabel={t('patientPortal.appointments.filterLabel')} testID="patient-appointments-filter">
          <Stack spacing="sm">
            <Select
              label={t('patientPortal.appointments.filterStatusLabel')}
              value={filterStatus}
              options={statusOptions}
              onValueChange={setFilterStatus}
              accessibilityLabel={t('patientPortal.appointments.filterStatusLabel')}
              accessibilityHint={t('patientPortal.appointments.filterStatusHint')}
              testID="patient-appointments-status-filter"
            />
            <Button
              variant="surface"
              size="small"
              onPress={loadAppointments}
              accessibilityLabel={t('patientPortal.appointments.refresh')}
              accessibilityHint={t('patientPortal.appointments.refreshHint')}
              testID="patient-appointments-refresh"
            >
              {t('patientPortal.appointments.refresh')}
            </Button>
          </Stack>
        </Card>

        <Button
          variant="surface"
          size="small"
          onPress={handleOpenCreate}
          disabled={!canWriteAppointments}
          aria-disabled={!canWriteAppointments}
          title={!canWriteAppointments ? writeBlockedReason : undefined}
          accessibilityLabel={t('patientPortal.appointments.newAppointment')}
          accessibilityHint={t('patientPortal.appointments.newAppointmentHint')}
          testID="patient-appointments-new"
        >
          {t('patientPortal.appointments.newAppointment')}
        </Button>
        {!canWriteAppointments ? (
          <Text variant="caption">{writeBlockedReason}</Text>
        ) : null}

        {formMode ? (
          <Card
            accessibilityLabel={t(
              formMode === FORM_MODE.EDIT
                ? 'patientPortal.appointments.editTitle'
                : 'patientPortal.appointments.createTitle'
            )}
            testID="patient-appointments-form"
          >
            <Stack spacing="sm">
              <Text variant="label">
                {t(
                  formMode === FORM_MODE.EDIT
                    ? 'patientPortal.appointments.editTitle'
                    : 'patientPortal.appointments.createTitle'
                )}
              </Text>

              <TextField
                label={t('patientPortal.appointments.form.startLabel')}
                value={formValues.scheduled_start}
                onChangeText={(value) =>
                  setFormValues((prev) => ({ ...prev, scheduled_start: value }))
                }
                type="datetime-local"
                placeholder={t('patientPortal.appointments.form.startPlaceholder')}
                errorMessage={formErrors.scheduled_start}
                required
                accessibilityLabel={t('patientPortal.appointments.form.startLabel')}
                accessibilityHint={t('patientPortal.appointments.form.startHint')}
                testID="patient-appointments-start"
              />

              <TextField
                label={t('patientPortal.appointments.form.endLabel')}
                value={formValues.scheduled_end}
                onChangeText={(value) =>
                  setFormValues((prev) => ({ ...prev, scheduled_end: value }))
                }
                type="datetime-local"
                placeholder={t('patientPortal.appointments.form.endPlaceholder')}
                errorMessage={formErrors.scheduled_end}
                required
                accessibilityLabel={t('patientPortal.appointments.form.endLabel')}
                accessibilityHint={t('patientPortal.appointments.form.endHint')}
                testID="patient-appointments-end"
              />

              <Select
                label={t('patientPortal.appointments.form.statusLabel')}
                value={String(formValues.status || 'SCHEDULED').toUpperCase()}
                options={APPOINTMENT_STATUS_VALUES.map((status) => ({
                  label: resolveEnumLabel(t, 'patientPortal.appointments.status', status),
                  value: status,
                }))}
                onValueChange={(value) =>
                  setFormValues((prev) => ({ ...prev, status: String(value || 'SCHEDULED') }))
                }
                errorMessage={formErrors.status}
                accessibilityLabel={t('patientPortal.appointments.form.statusLabel')}
                accessibilityHint={t('patientPortal.appointments.form.statusHint')}
                testID="patient-appointments-status"
              />

              <TextArea
                label={t('patientPortal.appointments.form.reasonLabel')}
                value={formValues.reason}
                onChangeText={(value) => setFormValues((prev) => ({ ...prev, reason: value }))}
                placeholder={t('patientPortal.appointments.form.reasonPlaceholder')}
                helperText={t('patientPortal.appointments.form.reasonHint')}
                accessibilityLabel={t('patientPortal.appointments.form.reasonLabel')}
                accessibilityHint={t('patientPortal.appointments.form.reasonHint')}
                testID="patient-appointments-reason"
              />

              <Stack spacing="xs">
                <Button
                  variant="surface"
                  size="small"
                  onPress={handleSubmit}
                  disabled={appointmentActionApi.isLoading}
                  aria-disabled={appointmentActionApi.isLoading}
                  accessibilityLabel={t('patientPortal.appointments.form.save')}
                  accessibilityHint={t('patientPortal.appointments.form.saveHint')}
                  testID="patient-appointments-save"
                >
                  {t('patientPortal.appointments.form.save')}
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => {
                    setFormMode(null);
                    setFormValues(defaultFormValues);
                    setFormErrors({});
                  }}
                  accessibilityLabel={t('common.cancel')}
                  accessibilityHint={t('patientPortal.appointments.form.cancelHint')}
                  testID="patient-appointments-cancel-edit"
                >
                  {t('common.cancel')}
                </Button>
              </Stack>
            </Stack>
          </Card>
        ) : null}

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-appointments-loading-indicator" />
        ) : null}

        {!isLoading && appointments.length === 0 ? (
          <EmptyState
            title={t('patientPortal.appointments.emptyTitle')}
            description={t('patientPortal.appointments.emptyMessage')}
            testID="patient-appointments-empty"
          />
        ) : null}

        {appointments.map((appointment) => {
          const status = resolveEnumLabel(
            t,
            'patientPortal.appointments.status',
            appointment?.status
          );
          const isCancelled = String(appointment?.status || '').toUpperCase() === 'CANCELLED';
          const isCompleted = String(appointment?.status || '').toUpperCase() === 'COMPLETED';
          const cancelBlocked = !canWriteAppointments || isCancelled || isCompleted;
          const editBlocked = !canWriteAppointments || isCancelled || isCompleted;
          const blockedReason = !canWriteAppointments
            ? writeBlockedReason
            : isCancelled
              ? t('patientPortal.appointments.cancelBlockedCancelled')
              : isCompleted
                ? t('patientPortal.appointments.cancelBlockedCompleted')
                : '';

          return (
            <Card key={appointment.id} testID={`patient-appointments-item-${appointment.id}`}>
              <Stack spacing="xs">
                <Text variant="label">
                  {formatDateTime(appointment?.scheduled_start || appointment?.scheduled_end, locale)}
                </Text>
                <Text variant="caption">
                  {t('patientPortal.appointments.itemStatus', { status })}
                </Text>
                <Text variant="caption">
                  {appointment?.reason || t('patientPortal.common.notAvailable')}
                </Text>
                <Stack spacing="xs">
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => loadAppointmentDetail(String(appointment.id))}
                    accessibilityLabel={t('patientPortal.appointments.viewDetails')}
                    accessibilityHint={t('patientPortal.appointments.viewDetailsHint')}
                    testID={`patient-appointments-view-${appointment.id}`}
                  >
                    {t('patientPortal.appointments.viewDetails')}
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => handleOpenEdit(appointment)}
                    disabled={editBlocked}
                    aria-disabled={editBlocked}
                    title={editBlocked ? blockedReason : undefined}
                    accessibilityLabel={t('patientPortal.appointments.reschedule')}
                    accessibilityHint={t('patientPortal.appointments.rescheduleHint')}
                    testID={`patient-appointments-edit-${appointment.id}`}
                  >
                    {t('patientPortal.appointments.reschedule')}
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => handleCancelAppointment(appointment)}
                    disabled={cancelBlocked}
                    aria-disabled={cancelBlocked}
                    title={cancelBlocked ? blockedReason : undefined}
                    accessibilityLabel={t('patientPortal.appointments.cancel')}
                    accessibilityHint={t('patientPortal.appointments.cancelHint')}
                    testID={`patient-appointments-cancel-${appointment.id}`}
                  >
                    {t('patientPortal.appointments.cancel')}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          );
        })}

        {selectedAppointment ? (
          <Card accessibilityLabel={t('patientPortal.appointments.detailTitle')} testID="patient-appointments-detail">
            <Stack spacing="xs">
              <Text variant="label">{t('patientPortal.appointments.detailTitle')}</Text>
              <Text variant="caption">
                {t('patientPortal.appointments.detailScheduled', {
                  when: formatDateTime(
                    selectedAppointment?.scheduled_start || selectedAppointment?.scheduled_end,
                    locale
                  ),
                })}
              </Text>
              <Text variant="caption">
                {t('patientPortal.appointments.detailStatus', {
                  status: resolveEnumLabel(
                    t,
                    'patientPortal.appointments.status',
                    selectedAppointment?.status
                  ),
                })}
              </Text>
              <Text variant="caption">
                {t('patientPortal.appointments.detailReason', {
                  reason: selectedAppointment?.reason || t('patientPortal.common.notAvailable'),
                })}
              </Text>

              <Text variant="label">{t('patientPortal.appointments.remindersTitle')}</Text>
              {reminderListApi.isLoading ? (
                <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-appointments-reminders-loading" />
              ) : reminders.length === 0 ? (
                <Text variant="caption">{t('patientPortal.appointments.noReminders')}</Text>
              ) : (
                reminders.map((reminder) => (
                  <Card
                    key={reminder.id}
                    variant="outlined"
                    testID={`patient-appointments-reminder-${reminder.id}`}
                  >
                    <Stack spacing="xs">
                      <Text variant="caption">
                        {t('patientPortal.appointments.reminderChannel', {
                          channel: resolveEnumLabel(
                            t,
                            'patientPortal.appointments.reminderChannelValues',
                            reminder?.channel
                          ),
                        })}
                      </Text>
                      <Text variant="caption">
                        {formatDateTime(reminder?.sent_at || reminder?.scheduled_at || reminder?.created_at, locale)}
                      </Text>
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
};

export default PatientAppointmentsScreen;
