/**
 * Clinical resource configuration shared by list/detail/form screens.
 */

const CLINICAL_RESOURCE_IDS = {
  ENCOUNTERS: 'encounters',
  CLINICAL_NOTES: 'clinical-notes',
  DIAGNOSES: 'diagnoses',
  PROCEDURES: 'procedures',
  VITAL_SIGNS: 'vital-signs',
  CARE_PLANS: 'care-plans',
  REFERRALS: 'referrals',
  FOLLOW_UPS: 'follow-ups',
};

const CLINICAL_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.ENCOUNTERS,
  CLINICAL_RESOURCE_IDS.CLINICAL_NOTES,
  CLINICAL_RESOURCE_IDS.DIAGNOSES,
  CLINICAL_RESOURCE_IDS.PROCEDURES,
  CLINICAL_RESOURCE_IDS.VITAL_SIGNS,
  CLINICAL_RESOURCE_IDS.CARE_PLANS,
  CLINICAL_RESOURCE_IDS.REFERRALS,
  CLINICAL_RESOURCE_IDS.FOLLOW_UPS,
];

const CLINICAL_ROUTE_ROOT = '/clinical';
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

const normalizeIsoDateValue = (value) => {
  const isoValue = toIsoDateTime(value);
  return isoValue || undefined;
};

const withClinicalContext = (path, context = {}) => {
  const searchParams = new URLSearchParams();
  const tenantId = normalizeContextId(context.tenantId);
  const facilityId = normalizeContextId(context.facilityId);
  const patientId = normalizeContextId(context.patientId);
  const providerUserId = normalizeContextId(context.providerUserId);
  const encounterId = normalizeContextId(context.encounterId);
  const authorUserId = normalizeContextId(context.authorUserId);
  const fromDepartmentId = normalizeContextId(context.fromDepartmentId);
  const toDepartmentId = normalizeContextId(context.toDepartmentId);
  const encounterType = sanitizeString(context.encounterType);
  const status = sanitizeString(context.status);
  const diagnosisType = sanitizeString(context.diagnosisType);
  const code = sanitizeString(context.code);
  const vitalType = sanitizeString(context.vitalType);
  const startDate = normalizeIsoDateValue(context.startDate);
  const endDate = normalizeIsoDateValue(context.endDate);

  if (tenantId) searchParams.set('tenantId', tenantId);
  if (facilityId) searchParams.set('facilityId', facilityId);
  if (patientId) searchParams.set('patientId', patientId);
  if (providerUserId) searchParams.set('providerUserId', providerUserId);
  if (encounterId) searchParams.set('encounterId', encounterId);
  if (authorUserId) searchParams.set('authorUserId', authorUserId);
  if (fromDepartmentId) searchParams.set('fromDepartmentId', fromDepartmentId);
  if (toDepartmentId) searchParams.set('toDepartmentId', toDepartmentId);
  if (encounterType) searchParams.set('encounterType', encounterType);
  if (status) searchParams.set('status', status);
  if (diagnosisType) searchParams.set('diagnosisType', diagnosisType);
  if (code) searchParams.set('code', code);
  if (vitalType) searchParams.set('vitalType', vitalType);
  if (startDate) searchParams.set('startDate', startDate);
  if (endDate) searchParams.set('endDate', endDate);

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

const ENCOUNTER_TYPE_OPTIONS = [
  { value: 'OPD', labelKey: 'clinical.options.encounterType.opd' },
  { value: 'IPD', labelKey: 'clinical.options.encounterType.ipd' },
  { value: 'ICU', labelKey: 'clinical.options.encounterType.icu' },
  { value: 'THEATRE', labelKey: 'clinical.options.encounterType.theatre' },
  { value: 'EMERGENCY', labelKey: 'clinical.options.encounterType.emergency' },
  { value: 'TELEMEDICINE', labelKey: 'clinical.options.encounterType.telemedicine' },
];

const ENCOUNTER_STATUS_OPTIONS = [
  { value: 'OPEN', labelKey: 'clinical.options.encounterStatus.open' },
  { value: 'CLOSED', labelKey: 'clinical.options.encounterStatus.closed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.encounterStatus.cancelled' },
];

const DIAGNOSIS_TYPE_OPTIONS = [
  { value: 'PRIMARY', labelKey: 'clinical.options.diagnosisType.primary' },
  { value: 'SECONDARY', labelKey: 'clinical.options.diagnosisType.secondary' },
  { value: 'DIFFERENTIAL', labelKey: 'clinical.options.diagnosisType.differential' },
];

const VITAL_TYPE_OPTIONS = [
  { value: 'TEMPERATURE', labelKey: 'clinical.options.vitalType.temperature' },
  { value: 'BLOOD_PRESSURE', labelKey: 'clinical.options.vitalType.bloodPressure' },
  { value: 'HEART_RATE', labelKey: 'clinical.options.vitalType.heartRate' },
  { value: 'RESPIRATORY_RATE', labelKey: 'clinical.options.vitalType.respiratoryRate' },
  { value: 'OXYGEN_SATURATION', labelKey: 'clinical.options.vitalType.oxygenSaturation' },
  { value: 'WEIGHT', labelKey: 'clinical.options.vitalType.weight' },
  { value: 'HEIGHT', labelKey: 'clinical.options.vitalType.height' },
  { value: 'BMI', labelKey: 'clinical.options.vitalType.bmi' },
];

const REFERRAL_CREATE_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.referralStatus.pending' },
  { value: 'APPROVED', labelKey: 'clinical.options.referralStatus.approved' },
  { value: 'REJECTED', labelKey: 'clinical.options.referralStatus.rejected' },
  { value: 'COMPLETED', labelKey: 'clinical.options.referralStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.referralStatus.cancelled' },
];

const REFERRAL_UPDATE_STATUS_OPTIONS = [
  { value: 'REQUESTED', labelKey: 'clinical.options.referralStatus.requested' },
  { value: 'APPROVED', labelKey: 'clinical.options.referralStatus.approved' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.referralStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.referralStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.referralStatus.cancelled' },
];

const buildDateTimeError = (value, t) => {
  if (!sanitizeString(value)) return null;
  if (toIsoDateTime(value)) return null;
  return t('clinical.common.form.dateTimeFormat');
};

const validateDateOrder = (startValue, endValue, t, { allowEqual = false } = {}) => {
  const startIso = toIsoDateTime(startValue);
  const endIso = toIsoDateTime(endValue);
  if (!startIso || !endIso) return null;
  const startTime = new Date(startIso).getTime();
  const endTime = new Date(endIso).getTime();
  if (allowEqual ? startTime <= endTime : startTime < endTime) return null;
  return allowEqual
    ? t('clinical.common.form.endOnOrAfterStart')
    : t('clinical.common.form.endAfterStart');
};

const getContextFilters = (resourceId, context) => {
  const tenantId = normalizeContextId(context?.tenantId);
  const facilityId = normalizeContextId(context?.facilityId);
  const patientId = normalizeContextId(context?.patientId);
  const providerUserId = normalizeContextId(context?.providerUserId);
  const encounterId = normalizeContextId(context?.encounterId);
  const authorUserId = normalizeContextId(context?.authorUserId);
  const fromDepartmentId = normalizeContextId(context?.fromDepartmentId);
  const toDepartmentId = normalizeContextId(context?.toDepartmentId);
  const encounterType = sanitizeString(context?.encounterType);
  const status = sanitizeString(context?.status);
  const diagnosisType = sanitizeString(context?.diagnosisType);
  const code = sanitizeString(context?.code);
  const vitalType = sanitizeString(context?.vitalType);
  const startDate = normalizeIsoDateValue(context?.startDate);
  const endDate = normalizeIsoDateValue(context?.endDate);

  if (resourceId === CLINICAL_RESOURCE_IDS.ENCOUNTERS) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      provider_user_id: providerUserId || undefined,
      encounter_type: encounterType || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CLINICAL_NOTES) {
    return {
      encounter_id: encounterId || undefined,
      author_user_id: authorUserId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DIAGNOSES) {
    return {
      encounter_id: encounterId || undefined,
      diagnosis_type: diagnosisType || undefined,
      code: code || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PROCEDURES) {
    return {
      encounter_id: encounterId || undefined,
      code: code || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.VITAL_SIGNS) {
    return {
      encounter_id: encounterId || undefined,
      vital_type: vitalType || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CARE_PLANS) {
    return {
      encounter_id: encounterId || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.REFERRALS) {
    return {
      encounter_id: encounterId || undefined,
      from_department_id: fromDepartmentId || undefined,
      to_department_id: toDepartmentId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.FOLLOW_UPS) {
    return {
      encounter_id: encounterId || undefined,
    };
  }

  return {};
};

const resourceConfigs = {
  [CLINICAL_RESOURCE_IDS.ENCOUNTERS]: {
    id: CLINICAL_RESOURCE_IDS.ENCOUNTERS,
    routePath: `${CLINICAL_ROUTE_ROOT}/encounters`,
    i18nKey: 'clinical.resources.encounters',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.encounters.form.patientIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.patientIdHint',
      },
      {
        name: 'provider_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.providerUserIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.providerUserIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.providerUserIdHint',
      },
      {
        name: 'encounter_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.encounters.form.encounterTypeLabel',
        placeholderKey: 'clinical.resources.encounters.form.encounterTypePlaceholder',
        hintKey: 'clinical.resources.encounters.form.encounterTypeHint',
        options: ENCOUNTER_TYPE_OPTIONS,
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.encounters.form.statusLabel',
        placeholderKey: 'clinical.resources.encounters.form.statusPlaceholder',
        hintKey: 'clinical.resources.encounters.form.statusHint',
        options: ENCOUNTER_STATUS_OPTIONS,
      },
      {
        name: 'started_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.startedAtLabel',
        placeholderKey: 'clinical.resources.encounters.form.startedAtPlaceholder',
        hintKey: 'clinical.resources.encounters.form.startedAtHint',
      },
      {
        name: 'ended_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.endedAtLabel',
        placeholderKey: 'clinical.resources.encounters.form.endedAtPlaceholder',
        hintKey: 'clinical.resources.encounters.form.endedAtHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      const encounterType = sanitizeString(item?.encounter_type);
      if (status && encounterType) {
        return `${t('clinical.resources.encounters.detail.statusLabel')}: ${status} - ${encounterType}`;
      }
      if (status) return `${t('clinical.resources.encounters.detail.statusLabel')}: ${status}`;
      return encounterType;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      provider_user_id: sanitizeString(record?.provider_user_id || context?.providerUserId),
      encounter_type: sanitizeString(record?.encounter_type || context?.encounterType || 'OPD'),
      status: sanitizeString(record?.status || context?.status || 'OPEN'),
      started_at: sanitizeString(record?.started_at),
      ended_at: sanitizeString(record?.ended_at),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const endedAtRaw = sanitizeString(values.ended_at);
      const payload = {
        provider_user_id: sanitizeString(values.provider_user_id) || undefined,
        encounter_type: sanitizeString(values.encounter_type),
        status: sanitizeString(values.status),
        started_at: toIsoDateTime(values.started_at),
        ended_at: endedAtRaw ? toIsoDateTime(endedAtRaw) : isEdit ? null : undefined,
        facility_id: sanitizeString(values.facility_id) || undefined,
      };

      if (!isEdit) {
        payload.patient_id = sanitizeString(values.patient_id);
      }

      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const startedAtError = buildDateTimeError(values.started_at, t);
      const endedAtError = buildDateTimeError(values.ended_at, t);
      if (startedAtError) errors.started_at = startedAtError;
      if (endedAtError) errors.ended_at = endedAtError;
      if (!endedAtError) {
        const orderError = validateDateOrder(values.started_at, values.ended_at, t, { allowEqual: false });
        if (orderError) errors.ended_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.encounters.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.encounters.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.encounters.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.encounters.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.encounters.detail.providerLabel', valueKey: 'provider_user_id' },
      { labelKey: 'clinical.resources.encounters.detail.encounterTypeLabel', valueKey: 'encounter_type' },
      { labelKey: 'clinical.resources.encounters.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.encounters.detail.startedAtLabel', valueKey: 'started_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.endedAtLabel', valueKey: 'ended_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CLINICAL_NOTES]: {
    id: CLINICAL_RESOURCE_IDS.CLINICAL_NOTES,
    routePath: `${CLINICAL_ROUTE_ROOT}/clinical-notes`,
    i18nKey: 'clinical.resources.clinicalNotes',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.clinicalNotes.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.encounterIdHint',
      },
      {
        name: 'author_user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.clinicalNotes.form.authorUserIdLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.authorUserIdPlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.authorUserIdHint',
      },
      {
        name: 'note',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.clinicalNotes.form.noteLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.notePlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.noteHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.note) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const authorUserId = sanitizeString(item?.author_user_id);
      if (!authorUserId) return '';
      return `${t('clinical.resources.clinicalNotes.detail.authorLabel')}: ${authorUserId}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      author_user_id: sanitizeString(record?.author_user_id || context?.authorUserId || context?.providerUserId),
      note: sanitizeString(record?.note),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        note: sanitizeString(values.note),
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
        payload.author_user_id = sanitizeString(values.author_user_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.clinicalNotes.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.authorLabel', valueKey: 'author_user_id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.noteLabel', valueKey: 'note' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DIAGNOSES]: {
    id: CLINICAL_RESOURCE_IDS.DIAGNOSES,
    routePath: `${CLINICAL_ROUTE_ROOT}/diagnoses`,
    i18nKey: 'clinical.resources.diagnoses',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.diagnoses.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.encounterIdHint',
      },
      {
        name: 'diagnosis_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.diagnoses.form.diagnosisTypeLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.diagnosisTypePlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.diagnosisTypeHint',
        options: DIAGNOSIS_TYPE_OPTIONS,
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.diagnoses.form.codeLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.codePlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.codeHint',
      },
      {
        name: 'description',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.diagnoses.form.descriptionLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.descriptionHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.description) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const diagnosisType = sanitizeString(item?.diagnosis_type);
      if (!diagnosisType) return '';
      return `${t('clinical.resources.diagnoses.detail.diagnosisTypeLabel')}: ${diagnosisType}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      diagnosis_type: sanitizeString(record?.diagnosis_type || context?.diagnosisType || 'PRIMARY'),
      code: sanitizeString(record?.code || context?.code),
      description: sanitizeString(record?.description),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        diagnosis_type: sanitizeString(values.diagnosis_type),
        code: sanitizeString(values.code) || undefined,
        description: sanitizeString(values.description),
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.diagnoses.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.diagnoses.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.diagnoses.detail.diagnosisTypeLabel', valueKey: 'diagnosis_type' },
      { labelKey: 'clinical.resources.diagnoses.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.diagnoses.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.diagnoses.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.diagnoses.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PROCEDURES]: {
    id: CLINICAL_RESOURCE_IDS.PROCEDURES,
    routePath: `${CLINICAL_ROUTE_ROOT}/procedures`,
    i18nKey: 'clinical.resources.procedures',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.procedures.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.procedures.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.procedures.form.encounterIdHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.procedures.form.codeLabel',
        placeholderKey: 'clinical.resources.procedures.form.codePlaceholder',
        hintKey: 'clinical.resources.procedures.form.codeHint',
      },
      {
        name: 'description',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.procedures.form.descriptionLabel',
        placeholderKey: 'clinical.resources.procedures.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.procedures.form.descriptionHint',
      },
      {
        name: 'performed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.procedures.form.performedAtLabel',
        placeholderKey: 'clinical.resources.procedures.form.performedAtPlaceholder',
        hintKey: 'clinical.resources.procedures.form.performedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.description) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const code = sanitizeString(item?.code);
      if (!code) return '';
      return `${t('clinical.resources.procedures.detail.codeLabel')}: ${code}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      code: sanitizeString(record?.code || context?.code),
      description: sanitizeString(record?.description),
      performed_at: sanitizeString(record?.performed_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        code: sanitizeString(values.code) || undefined,
        description: sanitizeString(values.description),
        performed_at: toIsoDateTime(values.performed_at) || undefined,
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const performedAtError = buildDateTimeError(values.performed_at, t);
      if (performedAtError) errors.performed_at = performedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.procedures.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.procedures.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.procedures.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.procedures.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.procedures.detail.performedAtLabel', valueKey: 'performed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.procedures.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.procedures.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.VITAL_SIGNS]: {
    id: CLINICAL_RESOURCE_IDS.VITAL_SIGNS,
    routePath: `${CLINICAL_ROUTE_ROOT}/vital-signs`,
    i18nKey: 'clinical.resources.vitalSigns',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.vitalSigns.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.encounterIdHint',
      },
      {
        name: 'vital_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.vitalSigns.form.vitalTypeLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.vitalTypePlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.vitalTypeHint',
        options: VITAL_TYPE_OPTIONS,
      },
      {
        name: 'value',
        type: 'text',
        required: true,
        maxLength: 80,
        labelKey: 'clinical.resources.vitalSigns.form.valueLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.valuePlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.valueHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 20,
        labelKey: 'clinical.resources.vitalSigns.form.unitLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.unitPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.unitHint',
      },
      {
        name: 'recorded_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.vitalSigns.form.recordedAtLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.recordedAtPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.recordedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.vital_type) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const value = sanitizeString(item?.value);
      if (!value) return '';
      return `${t('clinical.resources.vitalSigns.detail.valueLabel')}: ${value}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      vital_type: sanitizeString(record?.vital_type || context?.vitalType),
      value: sanitizeString(record?.value),
      unit: sanitizeString(record?.unit),
      recorded_at: sanitizeString(record?.recorded_at),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      vital_type: sanitizeString(values.vital_type),
      value: sanitizeString(values.value),
      unit: sanitizeString(values.unit) || undefined,
      recorded_at: toIsoDateTime(values.recorded_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const recordedAtError = buildDateTimeError(values.recorded_at, t);
      if (recordedAtError) errors.recorded_at = recordedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.vitalSigns.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.vitalSigns.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.vitalSigns.detail.vitalTypeLabel', valueKey: 'vital_type' },
      { labelKey: 'clinical.resources.vitalSigns.detail.valueLabel', valueKey: 'value' },
      { labelKey: 'clinical.resources.vitalSigns.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.vitalSigns.detail.recordedAtLabel', valueKey: 'recorded_at', type: 'datetime' },
      { labelKey: 'clinical.resources.vitalSigns.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.vitalSigns.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CARE_PLANS]: {
    id: CLINICAL_RESOURCE_IDS.CARE_PLANS,
    routePath: `${CLINICAL_ROUTE_ROOT}/care-plans`,
    i18nKey: 'clinical.resources.carePlans',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.carePlans.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.carePlans.form.encounterIdHint',
      },
      {
        name: 'plan',
        type: 'text',
        required: true,
        labelKey: 'clinical.resources.carePlans.form.planLabel',
        placeholderKey: 'clinical.resources.carePlans.form.planPlaceholder',
        hintKey: 'clinical.resources.carePlans.form.planHint',
      },
      {
        name: 'start_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.startDateLabel',
        placeholderKey: 'clinical.resources.carePlans.form.startDatePlaceholder',
        hintKey: 'clinical.resources.carePlans.form.startDateHint',
      },
      {
        name: 'end_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.endDateLabel',
        placeholderKey: 'clinical.resources.carePlans.form.endDatePlaceholder',
        hintKey: 'clinical.resources.carePlans.form.endDateHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.plan) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const startDate = sanitizeString(item?.start_date);
      if (!startDate) return '';
      return `${t('clinical.resources.carePlans.detail.startDateLabel')}: ${startDate}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      plan: sanitizeString(record?.plan),
      start_date: sanitizeString(record?.start_date || context?.startDate),
      end_date: sanitizeString(record?.end_date || context?.endDate),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      plan: sanitizeString(values.plan),
      start_date: toIsoDateTime(values.start_date) || undefined,
      end_date: toIsoDateTime(values.end_date) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const startDateError = buildDateTimeError(values.start_date, t);
      const endDateError = buildDateTimeError(values.end_date, t);
      if (startDateError) errors.start_date = startDateError;
      if (endDateError) errors.end_date = endDateError;
      if (!endDateError) {
        const orderError = validateDateOrder(values.start_date, values.end_date, t, { allowEqual: true });
        if (orderError) errors.end_date = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.carePlans.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.carePlans.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.carePlans.detail.planLabel', valueKey: 'plan' },
      { labelKey: 'clinical.resources.carePlans.detail.startDateLabel', valueKey: 'start_date', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.endDateLabel', valueKey: 'end_date', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.REFERRALS]: {
    id: CLINICAL_RESOURCE_IDS.REFERRALS,
    routePath: `${CLINICAL_ROUTE_ROOT}/referrals`,
    i18nKey: 'clinical.resources.referrals',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.referrals.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.encounterIdHint',
      },
      {
        name: 'from_department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.referrals.form.fromDepartmentIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.fromDepartmentIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.fromDepartmentIdHint',
      },
      {
        name: 'to_department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.referrals.form.toDepartmentIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.toDepartmentIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.toDepartmentIdHint',
      },
      {
        name: 'reason',
        type: 'text',
        required: false,
        maxLength: 10000,
        labelKey: 'clinical.resources.referrals.form.reasonLabel',
        placeholderKey: 'clinical.resources.referrals.form.reasonPlaceholder',
        hintKey: 'clinical.resources.referrals.form.reasonHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.referrals.form.statusLabel',
        placeholderKey: 'clinical.resources.referrals.form.statusPlaceholder',
        hintKey: 'clinical.resources.referrals.form.statusHint',
        options: ({ isEdit }) =>
          isEdit ? REFERRAL_UPDATE_STATUS_OPTIONS : REFERRAL_CREATE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.to_department_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.referrals.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      from_department_id: sanitizeString(record?.from_department_id || context?.fromDepartmentId),
      to_department_id: sanitizeString(record?.to_department_id || context?.toDepartmentId),
      reason: sanitizeString(record?.reason),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        from_department_id: sanitizeString(values.from_department_id) || undefined,
        to_department_id: sanitizeString(values.to_department_id) || undefined,
        reason: sanitizeString(values.reason) || undefined,
        status: sanitizeString(values.status),
      };

      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }

      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.referrals.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.referrals.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.referrals.detail.fromDepartmentLabel', valueKey: 'from_department_id' },
      { labelKey: 'clinical.resources.referrals.detail.toDepartmentLabel', valueKey: 'to_department_id' },
      { labelKey: 'clinical.resources.referrals.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.referrals.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.referrals.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.referrals.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.FOLLOW_UPS]: {
    id: CLINICAL_RESOURCE_IDS.FOLLOW_UPS,
    routePath: `${CLINICAL_ROUTE_ROOT}/follow-ups`,
    i18nKey: 'clinical.resources.followUps',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.followUps.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.followUps.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.followUps.form.encounterIdHint',
      },
      {
        name: 'scheduled_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.followUps.form.scheduledAtLabel',
        placeholderKey: 'clinical.resources.followUps.form.scheduledAtPlaceholder',
        hintKey: 'clinical.resources.followUps.form.scheduledAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 10000,
        labelKey: 'clinical.resources.followUps.form.notesLabel',
        placeholderKey: 'clinical.resources.followUps.form.notesPlaceholder',
        hintKey: 'clinical.resources.followUps.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.scheduled_at) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const scheduledAt = sanitizeString(item?.scheduled_at);
      if (!scheduledAt) return '';
      return `${t('clinical.resources.followUps.detail.scheduledAtLabel')}: ${scheduledAt}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      scheduled_at: sanitizeString(record?.scheduled_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        scheduled_at: toIsoDateTime(values.scheduled_at),
        notes: sanitizeString(values.notes) || undefined,
      };

      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }

      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const scheduledAtError = buildDateTimeError(values.scheduled_at, t);
      if (scheduledAtError) errors.scheduled_at = scheduledAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.followUps.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.followUps.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.followUps.detail.scheduledAtLabel', valueKey: 'scheduled_at', type: 'datetime' },
      { labelKey: 'clinical.resources.followUps.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.followUps.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.followUps.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
};

const getClinicalResourceConfig = (resourceId) => resourceConfigs[resourceId] || null;

export {
  CLINICAL_RESOURCE_IDS,
  CLINICAL_RESOURCE_LIST_ORDER,
  CLINICAL_ROUTE_ROOT,
  getClinicalResourceConfig,
  getContextFilters,
  normalizeContextId,
  normalizeRouteId,
  normalizeSearchParam,
  sanitizeString,
  toIsoDateTime,
  withClinicalContext,
};
