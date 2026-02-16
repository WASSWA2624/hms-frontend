/**
 * Scheduling resource configuration shared by list/detail/form screens.
 */

const SCHEDULING_RESOURCE_IDS = {
  APPOINTMENTS: 'appointments',
  APPOINTMENT_PARTICIPANTS: 'appointment-participants',
  APPOINTMENT_REMINDERS: 'appointment-reminders',
  PROVIDER_SCHEDULES: 'provider-schedules',
  AVAILABILITY_SLOTS: 'availability-slots',
  VISIT_QUEUES: 'visit-queues',
};

const SCHEDULING_RESOURCE_LIST_ORDER = [
  SCHEDULING_RESOURCE_IDS.APPOINTMENTS,
  SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS,
  SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS,
  SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES,
  SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS,
  SCHEDULING_RESOURCE_IDS.VISIT_QUEUES,
];

const SCHEDULING_ROUTE_ROOT = '/scheduling';
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const sanitizeString = (value) => (value == null ? '' : String(value).trim());

const normalizeRouteId = (value) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = sanitizeString(candidate);
  if (!normalized) return null;
  return /^[A-Za-z0-9._:-]+$/.test(normalized) ? normalized : null;
};

const normalizeSearchParam = (value) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = sanitizeString(candidate);
  return normalized || null;
};

const normalizeContextId = (value) => normalizeRouteId(value);

const toIsoDateTime = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;
  if (DATE_ONLY_REGEX.test(normalized)) {
    return `${normalized}T00:00:00.000Z`;
  }
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const toDayOfWeek = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 6) return undefined;
  return parsed;
};

const withSchedulingContext = (path, context = {}) => {
  const searchParams = new URLSearchParams();
  const patientId = normalizeContextId(context.patientId);
  const providerUserId = normalizeContextId(context.providerUserId);
  const scheduleId = normalizeContextId(context.scheduleId);
  const appointmentId = normalizeContextId(context.appointmentId);
  const queueStatus = sanitizeString(context.status);
  const dayOfWeek = toDayOfWeek(context.dayOfWeek);
  const isAvailable = context.isAvailable === true || context.isAvailable === false
    ? String(context.isAvailable)
    : '';

  if (patientId) searchParams.set('patientId', patientId);
  if (providerUserId) searchParams.set('providerUserId', providerUserId);
  if (scheduleId) searchParams.set('scheduleId', scheduleId);
  if (appointmentId) searchParams.set('appointmentId', appointmentId);
  if (queueStatus) searchParams.set('status', queueStatus);
  if (dayOfWeek !== undefined) searchParams.set('dayOfWeek', String(dayOfWeek));
  if (isAvailable) searchParams.set('isAvailable', isAvailable);

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'SCHEDULED', labelKey: 'scheduling.options.status.scheduled' },
  { value: 'CONFIRMED', labelKey: 'scheduling.options.status.confirmed' },
  { value: 'IN_PROGRESS', labelKey: 'scheduling.options.status.inProgress' },
  { value: 'COMPLETED', labelKey: 'scheduling.options.status.completed' },
  { value: 'CANCELLED', labelKey: 'scheduling.options.status.cancelled' },
  { value: 'NO_SHOW', labelKey: 'scheduling.options.status.noShow' },
];

const REMINDER_CHANNEL_OPTIONS = [
  { value: 'EMAIL', labelKey: 'scheduling.options.reminderChannel.email' },
  { value: 'SMS', labelKey: 'scheduling.options.reminderChannel.sms' },
  { value: 'PUSH', labelKey: 'scheduling.options.reminderChannel.push' },
  { value: 'WHATSAPP', labelKey: 'scheduling.options.reminderChannel.whatsapp' },
  { value: 'IN_APP', labelKey: 'scheduling.options.reminderChannel.inApp' },
];

const DAY_OF_WEEK_OPTIONS = [
  { value: '0', labelKey: 'scheduling.options.dayOfWeek.sunday' },
  { value: '1', labelKey: 'scheduling.options.dayOfWeek.monday' },
  { value: '2', labelKey: 'scheduling.options.dayOfWeek.tuesday' },
  { value: '3', labelKey: 'scheduling.options.dayOfWeek.wednesday' },
  { value: '4', labelKey: 'scheduling.options.dayOfWeek.thursday' },
  { value: '5', labelKey: 'scheduling.options.dayOfWeek.friday' },
  { value: '6', labelKey: 'scheduling.options.dayOfWeek.saturday' },
];

const buildDateTimeError = (value, t) => {
  if (!sanitizeString(value)) return null;
  if (toIsoDateTime(value)) return null;
  return t('scheduling.common.form.dateTimeFormat');
};

const validateDateOrder = (startValue, endValue, t) => {
  const startIso = toIsoDateTime(startValue);
  const endIso = toIsoDateTime(endValue);
  if (!startIso || !endIso) return null;
  if (new Date(startIso).getTime() < new Date(endIso).getTime()) return null;
  return t('scheduling.common.form.endAfterStart');
};

const getContextFilters = (resourceId, context) => {
  const patientId = normalizeContextId(context?.patientId);
  const providerUserId = normalizeContextId(context?.providerUserId);
  const scheduleId = normalizeContextId(context?.scheduleId);
  const appointmentId = normalizeContextId(context?.appointmentId);
  const status = sanitizeString(context?.status);
  const dayOfWeek = toDayOfWeek(context?.dayOfWeek);
  const isAvailable = sanitizeString(context?.isAvailable).toLowerCase();

  if (resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS) {
    return {
      patient_id: patientId || undefined,
      provider_user_id: providerUserId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS) {
    return {
      appointment_id: appointmentId || undefined,
      participant_patient_id: patientId || undefined,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS) {
    return {
      appointment_id: appointmentId || undefined,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES) {
    return {
      provider_user_id: providerUserId || undefined,
      day_of_week: dayOfWeek,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS) {
    return {
      schedule_id: scheduleId || undefined,
      is_available: isAvailable === 'true' || isAvailable === 'false' ? isAvailable === 'true' : undefined,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.VISIT_QUEUES) {
    return {
      patient_id: patientId || undefined,
      appointment_id: appointmentId || undefined,
      provider_user_id: providerUserId || undefined,
      status: status || undefined,
    };
  }

  return {};
};

const resourceConfigs = {
  [SCHEDULING_RESOURCE_IDS.APPOINTMENTS]: {
    id: SCHEDULING_RESOURCE_IDS.APPOINTMENTS,
    routePath: `${SCHEDULING_ROUTE_ROOT}/appointments`,
    i18nKey: 'scheduling.resources.appointments',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointments.form.patientIdLabel',
        placeholderKey: 'scheduling.resources.appointments.form.patientIdPlaceholder',
        hintKey: 'scheduling.resources.appointments.form.patientIdHint',
      },
      {
        name: 'provider_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointments.form.providerUserIdLabel',
        placeholderKey: 'scheduling.resources.appointments.form.providerUserIdPlaceholder',
        hintKey: 'scheduling.resources.appointments.form.providerUserIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'scheduling.resources.appointments.form.statusLabel',
        placeholderKey: 'scheduling.resources.appointments.form.statusPlaceholder',
        hintKey: 'scheduling.resources.appointments.form.statusHint',
        options: APPOINTMENT_STATUS_OPTIONS,
      },
      {
        name: 'scheduled_start',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointments.form.scheduledStartLabel',
        placeholderKey: 'scheduling.resources.appointments.form.scheduledStartPlaceholder',
        hintKey: 'scheduling.resources.appointments.form.scheduledStartHint',
      },
      {
        name: 'scheduled_end',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointments.form.scheduledEndLabel',
        placeholderKey: 'scheduling.resources.appointments.form.scheduledEndPlaceholder',
        hintKey: 'scheduling.resources.appointments.form.scheduledEndHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointments.form.facilityIdLabel',
        placeholderKey: 'scheduling.resources.appointments.form.facilityIdPlaceholder',
        hintKey: 'scheduling.resources.appointments.form.facilityIdHint',
      },
      {
        name: 'reason',
        type: 'text',
        required: false,
        maxLength: 65535,
        labelKey: 'scheduling.resources.appointments.form.reasonLabel',
        placeholderKey: 'scheduling.resources.appointments.form.reasonPlaceholder',
        hintKey: 'scheduling.resources.appointments.form.reasonHint',
      },
    ],
    getItemTitle: (item) =>
      sanitizeString(item?.reason) ||
      sanitizeString(item?.scheduled_start) ||
      sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('scheduling.resources.appointments.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      provider_user_id: sanitizeString(record?.provider_user_id || context?.providerUserId),
      status: sanitizeString(record?.status || 'SCHEDULED'),
      scheduled_start: sanitizeString(record?.scheduled_start),
      scheduled_end: sanitizeString(record?.scheduled_end),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      reason: sanitizeString(record?.reason),
    }),
    toPayload: (values) => ({
      patient_id: sanitizeString(values.patient_id),
      provider_user_id: sanitizeString(values.provider_user_id) || undefined,
      status: sanitizeString(values.status),
      scheduled_start: toIsoDateTime(values.scheduled_start),
      scheduled_end: toIsoDateTime(values.scheduled_end),
      facility_id: sanitizeString(values.facility_id) || undefined,
      reason: sanitizeString(values.reason) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const startError = buildDateTimeError(values.scheduled_start, t);
      const endError = buildDateTimeError(values.scheduled_end, t);
      if (startError) errors.scheduled_start = startError;
      if (endError) errors.scheduled_end = endError;
      if (!endError) {
        const orderError = validateDateOrder(values.scheduled_start, values.scheduled_end, t);
        if (orderError) errors.scheduled_end = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'scheduling.resources.appointments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'scheduling.resources.appointments.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'scheduling.resources.appointments.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'scheduling.resources.appointments.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'scheduling.resources.appointments.detail.providerLabel', valueKey: 'provider_user_id' },
      { labelKey: 'scheduling.resources.appointments.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'scheduling.resources.appointments.detail.scheduledStartLabel', valueKey: 'scheduled_start', type: 'datetime' },
      { labelKey: 'scheduling.resources.appointments.detail.scheduledEndLabel', valueKey: 'scheduled_end', type: 'datetime' },
      { labelKey: 'scheduling.resources.appointments.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'scheduling.resources.appointments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.appointments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS]: {
    id: SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS,
    routePath: `${SCHEDULING_ROUTE_ROOT}/appointment-participants`,
    i18nKey: 'scheduling.resources.appointmentParticipants',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'appointment_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointmentParticipants.form.appointmentIdLabel',
        placeholderKey: 'scheduling.resources.appointmentParticipants.form.appointmentIdPlaceholder',
        hintKey: 'scheduling.resources.appointmentParticipants.form.appointmentIdHint',
      },
      {
        name: 'participant_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointmentParticipants.form.participantUserIdLabel',
        placeholderKey: 'scheduling.resources.appointmentParticipants.form.participantUserIdPlaceholder',
        hintKey: 'scheduling.resources.appointmentParticipants.form.participantUserIdHint',
      },
      {
        name: 'participant_patient_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointmentParticipants.form.participantPatientIdLabel',
        placeholderKey: 'scheduling.resources.appointmentParticipants.form.participantPatientIdPlaceholder',
        hintKey: 'scheduling.resources.appointmentParticipants.form.participantPatientIdHint',
      },
      {
        name: 'role',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'scheduling.resources.appointmentParticipants.form.roleLabel',
        placeholderKey: 'scheduling.resources.appointmentParticipants.form.rolePlaceholder',
        hintKey: 'scheduling.resources.appointmentParticipants.form.roleHint',
      },
    ],
    getItemTitle: (item) =>
      sanitizeString(item?.role) ||
      sanitizeString(item?.participant_user_id) ||
      sanitizeString(item?.participant_patient_id) ||
      sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const appointmentId = sanitizeString(item?.appointment_id);
      if (!appointmentId) return '';
      return `${t('scheduling.resources.appointmentParticipants.detail.appointmentLabel')}: ${appointmentId}`;
    },
    getInitialValues: (record, context) => ({
      appointment_id: sanitizeString(record?.appointment_id || context?.appointmentId),
      participant_user_id: sanitizeString(record?.participant_user_id || context?.providerUserId),
      participant_patient_id: sanitizeString(record?.participant_patient_id || context?.patientId),
      role: sanitizeString(record?.role),
    }),
    toPayload: (values) => ({
      appointment_id: sanitizeString(values.appointment_id),
      participant_user_id: sanitizeString(values.participant_user_id) || undefined,
      participant_patient_id: sanitizeString(values.participant_patient_id) || undefined,
      role: sanitizeString(values.role) || undefined,
    }),
    detailRows: [
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.idLabel', valueKey: 'id' },
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.appointmentLabel', valueKey: 'appointment_id' },
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.participantUserLabel', valueKey: 'participant_user_id' },
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.participantPatientLabel', valueKey: 'participant_patient_id' },
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.roleLabel', valueKey: 'role' },
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.appointmentParticipants.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS]: {
    id: SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS,
    routePath: `${SCHEDULING_ROUTE_ROOT}/appointment-reminders`,
    i18nKey: 'scheduling.resources.appointmentReminders',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'appointment_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointmentReminders.form.appointmentIdLabel',
        placeholderKey: 'scheduling.resources.appointmentReminders.form.appointmentIdPlaceholder',
        hintKey: 'scheduling.resources.appointmentReminders.form.appointmentIdHint',
      },
      {
        name: 'channel',
        type: 'select',
        required: true,
        labelKey: 'scheduling.resources.appointmentReminders.form.channelLabel',
        placeholderKey: 'scheduling.resources.appointmentReminders.form.channelPlaceholder',
        hintKey: 'scheduling.resources.appointmentReminders.form.channelHint',
        options: REMINDER_CHANNEL_OPTIONS,
      },
      {
        name: 'scheduled_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointmentReminders.form.scheduledAtLabel',
        placeholderKey: 'scheduling.resources.appointmentReminders.form.scheduledAtPlaceholder',
        hintKey: 'scheduling.resources.appointmentReminders.form.scheduledAtHint',
      },
      {
        name: 'sent_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.appointmentReminders.form.sentAtLabel',
        placeholderKey: 'scheduling.resources.appointmentReminders.form.sentAtPlaceholder',
        hintKey: 'scheduling.resources.appointmentReminders.form.sentAtHint',
      },
    ],
    getItemTitle: (item) =>
      sanitizeString(item?.channel) ||
      sanitizeString(item?.scheduled_at) ||
      sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const appointmentId = sanitizeString(item?.appointment_id);
      if (!appointmentId) return '';
      return `${t('scheduling.resources.appointmentReminders.detail.appointmentLabel')}: ${appointmentId}`;
    },
    getInitialValues: (record, context) => ({
      appointment_id: sanitizeString(record?.appointment_id || context?.appointmentId),
      channel: sanitizeString(record?.channel),
      scheduled_at: sanitizeString(record?.scheduled_at),
      sent_at: sanitizeString(record?.sent_at),
    }),
    toPayload: (values) => ({
      appointment_id: sanitizeString(values.appointment_id),
      channel: sanitizeString(values.channel),
      scheduled_at: toIsoDateTime(values.scheduled_at),
      sent_at: toIsoDateTime(values.sent_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const scheduledAtError = buildDateTimeError(values.scheduled_at, t);
      const sentAtError = buildDateTimeError(values.sent_at, t);
      if (scheduledAtError) errors.scheduled_at = scheduledAtError;
      if (sentAtError) errors.sent_at = sentAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'scheduling.resources.appointmentReminders.detail.idLabel', valueKey: 'id' },
      { labelKey: 'scheduling.resources.appointmentReminders.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'scheduling.resources.appointmentReminders.detail.appointmentLabel', valueKey: 'appointment_id' },
      { labelKey: 'scheduling.resources.appointmentReminders.detail.channelLabel', valueKey: 'channel' },
      { labelKey: 'scheduling.resources.appointmentReminders.detail.scheduledAtLabel', valueKey: 'scheduled_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.appointmentReminders.detail.sentAtLabel', valueKey: 'sent_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.appointmentReminders.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.appointmentReminders.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES]: {
    id: SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES,
    routePath: `${SCHEDULING_ROUTE_ROOT}/provider-schedules`,
    i18nKey: 'scheduling.resources.providerSchedules',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'provider_user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.providerSchedules.form.providerUserIdLabel',
        placeholderKey: 'scheduling.resources.providerSchedules.form.providerUserIdPlaceholder',
        hintKey: 'scheduling.resources.providerSchedules.form.providerUserIdHint',
      },
      {
        name: 'day_of_week',
        type: 'select',
        required: true,
        labelKey: 'scheduling.resources.providerSchedules.form.dayOfWeekLabel',
        placeholderKey: 'scheduling.resources.providerSchedules.form.dayOfWeekPlaceholder',
        hintKey: 'scheduling.resources.providerSchedules.form.dayOfWeekHint',
        options: DAY_OF_WEEK_OPTIONS,
      },
      {
        name: 'start_time',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.providerSchedules.form.startTimeLabel',
        placeholderKey: 'scheduling.resources.providerSchedules.form.startTimePlaceholder',
        hintKey: 'scheduling.resources.providerSchedules.form.startTimeHint',
      },
      {
        name: 'end_time',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.providerSchedules.form.endTimeLabel',
        placeholderKey: 'scheduling.resources.providerSchedules.form.endTimePlaceholder',
        hintKey: 'scheduling.resources.providerSchedules.form.endTimeHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.providerSchedules.form.facilityIdLabel',
        placeholderKey: 'scheduling.resources.providerSchedules.form.facilityIdPlaceholder',
        hintKey: 'scheduling.resources.providerSchedules.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.provider_user_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const day = sanitizeString(item?.day_of_week);
      if (!day) return '';
      return `${t('scheduling.resources.providerSchedules.detail.dayOfWeekLabel')}: ${day}`;
    },
    getInitialValues: (record, context) => ({
      provider_user_id: sanitizeString(record?.provider_user_id || context?.providerUserId),
      day_of_week: sanitizeString(record?.day_of_week),
      start_time: sanitizeString(record?.start_time),
      end_time: sanitizeString(record?.end_time),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values) => ({
      provider_user_id: sanitizeString(values.provider_user_id),
      day_of_week: toDayOfWeek(values.day_of_week),
      start_time: toIsoDateTime(values.start_time),
      end_time: toIsoDateTime(values.end_time),
      facility_id: sanitizeString(values.facility_id) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      if (toDayOfWeek(values.day_of_week) === undefined) {
        errors.day_of_week = t('scheduling.common.form.dayOfWeekRange');
      }
      const startError = buildDateTimeError(values.start_time, t);
      const endError = buildDateTimeError(values.end_time, t);
      if (startError) errors.start_time = startError;
      if (endError) errors.end_time = endError;
      if (!endError) {
        const orderError = validateDateOrder(values.start_time, values.end_time, t);
        if (orderError) errors.end_time = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'scheduling.resources.providerSchedules.detail.idLabel', valueKey: 'id' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.providerLabel', valueKey: 'provider_user_id' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.dayOfWeekLabel', valueKey: 'day_of_week' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.startTimeLabel', valueKey: 'start_time', type: 'datetime' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.endTimeLabel', valueKey: 'end_time', type: 'datetime' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.providerSchedules.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS]: {
    id: SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS,
    routePath: `${SCHEDULING_ROUTE_ROOT}/availability-slots`,
    i18nKey: 'scheduling.resources.availabilitySlots',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'schedule_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.availabilitySlots.form.scheduleIdLabel',
        placeholderKey: 'scheduling.resources.availabilitySlots.form.scheduleIdPlaceholder',
        hintKey: 'scheduling.resources.availabilitySlots.form.scheduleIdHint',
      },
      {
        name: 'start_time',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.availabilitySlots.form.startTimeLabel',
        placeholderKey: 'scheduling.resources.availabilitySlots.form.startTimePlaceholder',
        hintKey: 'scheduling.resources.availabilitySlots.form.startTimeHint',
      },
      {
        name: 'end_time',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.availabilitySlots.form.endTimeLabel',
        placeholderKey: 'scheduling.resources.availabilitySlots.form.endTimePlaceholder',
        hintKey: 'scheduling.resources.availabilitySlots.form.endTimeHint',
      },
      {
        name: 'is_available',
        type: 'switch',
        required: false,
        labelKey: 'scheduling.resources.availabilitySlots.form.availableLabel',
        hintKey: 'scheduling.resources.availabilitySlots.form.availableHint',
      },
    ],
    getItemTitle: (item) =>
      sanitizeString(item?.schedule_id) ||
      sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const available = item?.is_available !== false
        ? t('scheduling.resources.availabilitySlots.detail.availableTrue')
        : t('scheduling.resources.availabilitySlots.detail.availableFalse');
      return `${t('scheduling.resources.availabilitySlots.detail.availableLabel')}: ${available}`;
    },
    getInitialValues: (record, context) => ({
      schedule_id: sanitizeString(record?.schedule_id || context?.scheduleId),
      start_time: sanitizeString(record?.start_time),
      end_time: sanitizeString(record?.end_time),
      is_available: record?.is_available !== false,
    }),
    toPayload: (values) => ({
      schedule_id: sanitizeString(values.schedule_id),
      start_time: toIsoDateTime(values.start_time),
      end_time: toIsoDateTime(values.end_time),
      is_available: values.is_available !== false,
    }),
    validate: (values, t) => {
      const errors = {};
      const startError = buildDateTimeError(values.start_time, t);
      const endError = buildDateTimeError(values.end_time, t);
      if (startError) errors.start_time = startError;
      if (endError) errors.end_time = endError;
      if (!endError) {
        const orderError = validateDateOrder(values.start_time, values.end_time, t);
        if (orderError) errors.end_time = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'scheduling.resources.availabilitySlots.detail.idLabel', valueKey: 'id' },
      { labelKey: 'scheduling.resources.availabilitySlots.detail.scheduleLabel', valueKey: 'schedule_id' },
      { labelKey: 'scheduling.resources.availabilitySlots.detail.startTimeLabel', valueKey: 'start_time', type: 'datetime' },
      { labelKey: 'scheduling.resources.availabilitySlots.detail.endTimeLabel', valueKey: 'end_time', type: 'datetime' },
      { labelKey: 'scheduling.resources.availabilitySlots.detail.availableLabel', valueKey: 'is_available', type: 'boolean' },
      { labelKey: 'scheduling.resources.availabilitySlots.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.availabilitySlots.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [SCHEDULING_RESOURCE_IDS.VISIT_QUEUES]: {
    id: SCHEDULING_RESOURCE_IDS.VISIT_QUEUES,
    routePath: `${SCHEDULING_ROUTE_ROOT}/visit-queues`,
    i18nKey: 'scheduling.resources.visitQueues',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'scheduling.resources.visitQueues.form.patientIdLabel',
        placeholderKey: 'scheduling.resources.visitQueues.form.patientIdPlaceholder',
        hintKey: 'scheduling.resources.visitQueues.form.patientIdHint',
      },
      {
        name: 'appointment_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.visitQueues.form.appointmentIdLabel',
        placeholderKey: 'scheduling.resources.visitQueues.form.appointmentIdPlaceholder',
        hintKey: 'scheduling.resources.visitQueues.form.appointmentIdHint',
      },
      {
        name: 'provider_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.visitQueues.form.providerUserIdLabel',
        placeholderKey: 'scheduling.resources.visitQueues.form.providerUserIdPlaceholder',
        hintKey: 'scheduling.resources.visitQueues.form.providerUserIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'scheduling.resources.visitQueues.form.statusLabel',
        placeholderKey: 'scheduling.resources.visitQueues.form.statusPlaceholder',
        hintKey: 'scheduling.resources.visitQueues.form.statusHint',
        options: APPOINTMENT_STATUS_OPTIONS,
      },
      {
        name: 'queued_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.visitQueues.form.queuedAtLabel',
        placeholderKey: 'scheduling.resources.visitQueues.form.queuedAtPlaceholder',
        hintKey: 'scheduling.resources.visitQueues.form.queuedAtHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'scheduling.resources.visitQueues.form.facilityIdLabel',
        placeholderKey: 'scheduling.resources.visitQueues.form.facilityIdPlaceholder',
        hintKey: 'scheduling.resources.visitQueues.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) =>
      sanitizeString(item?.patient_id) ||
      sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('scheduling.resources.visitQueues.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      appointment_id: sanitizeString(record?.appointment_id || context?.appointmentId),
      provider_user_id: sanitizeString(record?.provider_user_id || context?.providerUserId),
      status: sanitizeString(record?.status || 'SCHEDULED'),
      queued_at: sanitizeString(record?.queued_at),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values) => ({
      patient_id: sanitizeString(values.patient_id),
      appointment_id: sanitizeString(values.appointment_id) || undefined,
      provider_user_id: sanitizeString(values.provider_user_id) || undefined,
      status: sanitizeString(values.status),
      queued_at: toIsoDateTime(values.queued_at),
      facility_id: sanitizeString(values.facility_id) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const queuedAtError = buildDateTimeError(values.queued_at, t);
      if (queuedAtError) errors.queued_at = queuedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'scheduling.resources.visitQueues.detail.idLabel', valueKey: 'id' },
      { labelKey: 'scheduling.resources.visitQueues.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'scheduling.resources.visitQueues.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'scheduling.resources.visitQueues.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'scheduling.resources.visitQueues.detail.appointmentLabel', valueKey: 'appointment_id' },
      { labelKey: 'scheduling.resources.visitQueues.detail.providerLabel', valueKey: 'provider_user_id' },
      { labelKey: 'scheduling.resources.visitQueues.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'scheduling.resources.visitQueues.detail.queuedAtLabel', valueKey: 'queued_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.visitQueues.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'scheduling.resources.visitQueues.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
};

const getSchedulingResourceConfig = (resourceId) => resourceConfigs[resourceId] || null;

export {
  getContextFilters,
  getSchedulingResourceConfig,
  normalizeContextId,
  normalizeRouteId,
  normalizeSearchParam,
  sanitizeString,
  SCHEDULING_RESOURCE_IDS,
  SCHEDULING_RESOURCE_LIST_ORDER,
  SCHEDULING_ROUTE_ROOT,
  toDayOfWeek,
  toIsoDateTime,
  withSchedulingContext,
};
