/**
 * Patient resource configuration shared by list/detail/form screens.
 */
import { humanizeIdentifier } from '@utils';

const PATIENT_RESOURCE_IDS = {
  PATIENTS: 'patients',
  PATIENT_IDENTIFIERS: 'patient-identifiers',
  PATIENT_CONTACTS: 'patient-contacts',
  PATIENT_GUARDIANS: 'patient-guardians',
  PATIENT_ALLERGIES: 'patient-allergies',
  PATIENT_MEDICAL_HISTORIES: 'patient-medical-histories',
  PATIENT_DOCUMENTS: 'patient-documents',
  CONSENTS: 'consents',
  TERMS_ACCEPTANCES: 'terms-acceptances',
};

const PATIENT_RESOURCE_LIST_ORDER = [
  PATIENT_RESOURCE_IDS.PATIENTS,
  PATIENT_RESOURCE_IDS.PATIENT_IDENTIFIERS,
  PATIENT_RESOURCE_IDS.PATIENT_CONTACTS,
  PATIENT_RESOURCE_IDS.PATIENT_GUARDIANS,
  PATIENT_RESOURCE_IDS.PATIENT_ALLERGIES,
  PATIENT_RESOURCE_IDS.PATIENT_MEDICAL_HISTORIES,
  PATIENT_RESOURCE_IDS.PATIENT_DOCUMENTS,
  PATIENT_RESOURCE_IDS.CONSENTS,
  PATIENT_RESOURCE_IDS.TERMS_ACCEPTANCES,
];

const PATIENT_ROUTE_ROOT = '/patients';

const sanitizeString = (value) => (value == null ? '' : String(value).trim());
const sanitizeReadable = (value) => sanitizeString(humanizeIdentifier(value));
const resolveFirstReadable = (...candidates) => (
  candidates.map((candidate) => sanitizeReadable(candidate)).find(Boolean) || ''
);

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

const withPatientContext = (path, patientId) => {
  const normalizedPatientId = normalizeRouteId(patientId);
  if (!normalizedPatientId) return path;
  return `${path}?patientId=${encodeURIComponent(normalizedPatientId)}`;
};

const getPersonName = (item) => {
  const firstName = sanitizeString(item?.first_name);
  const lastName = sanitizeString(item?.last_name);
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) return fullName;
  return resolveFirstReadable(
    item?.name,
    item?.patient_code,
    item?.patient_number,
    item?.medical_record_number,
    item?.mrn,
    item?.identifier_value
  );
};

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const toDateOnly = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return '';
  if (DATE_ONLY_REGEX.test(normalized)) return normalized;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};

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

const resourceConfigs = {
  [PATIENT_RESOURCE_IDS.PATIENTS]: {
    id: PATIENT_RESOURCE_IDS.PATIENTS,
    routePath: `${PATIENT_ROUTE_ROOT}/patients`,
    i18nKey: 'patients.resources.patients',
    supportsPatientFilter: false,
    requiresPatientSelection: false,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'first_name',
        type: 'text',
        required: true,
        maxLength: 120,
        labelKey: 'patients.resources.patients.form.firstNameLabel',
        placeholderKey: 'patients.resources.patients.form.firstNamePlaceholder',
        hintKey: 'patients.resources.patients.form.firstNameHint',
      },
      {
        name: 'last_name',
        type: 'text',
        required: true,
        maxLength: 120,
        labelKey: 'patients.resources.patients.form.lastNameLabel',
        placeholderKey: 'patients.resources.patients.form.lastNamePlaceholder',
        hintKey: 'patients.resources.patients.form.lastNameHint',
      },
      {
        name: 'date_of_birth',
        type: 'text',
        required: false,
        maxLength: 20,
        labelKey: 'patients.resources.patients.form.dateOfBirthLabel',
        placeholderKey: 'patients.resources.patients.form.dateOfBirthPlaceholder',
        hintKey: 'patients.resources.patients.form.dateOfBirthHint',
      },
      {
        name: 'gender',
        type: 'select',
        required: false,
        labelKey: 'patients.resources.patients.form.genderLabel',
        placeholderKey: 'patients.resources.patients.form.genderPlaceholder',
        hintKey: 'patients.resources.patients.form.genderHint',
        options: [
          { value: 'MALE', labelKey: 'patients.resources.patients.options.gender.male' },
          { value: 'FEMALE', labelKey: 'patients.resources.patients.options.gender.female' },
          { value: 'OTHER', labelKey: 'patients.resources.patients.options.gender.other' },
          { value: 'UNKNOWN', labelKey: 'patients.resources.patients.options.gender.unknown' },
        ],
      },
      {
        name: 'facility_id',
        type: 'select',
        required: false,
        maxLength: 64,
        labelKey: 'patients.resources.patients.form.facilityLabel',
        placeholderKey: 'patients.resources.patients.form.facilityPlaceholder',
        hintKey: 'patients.resources.patients.form.facilityHint',
      },
      {
        name: 'is_active',
        type: 'switch',
        required: false,
        labelKey: 'patients.resources.patients.form.activeLabel',
        hintKey: 'patients.resources.patients.form.activeHint',
      },
    ],
    getItemTitle: (item) => getPersonName(item),
    getItemSubtitle: (item, t) => {
      const gender = sanitizeString(item?.gender);
      const dob = sanitizeString(item?.date_of_birth);
      if (gender && dob) {
        return `${t('patients.resources.patients.detail.genderLabel')}: ${gender} - ${toDateOnly(dob)}`;
      }
      if (gender) return `${t('patients.resources.patients.detail.genderLabel')}: ${gender}`;
      if (dob) return `${t('patients.resources.patients.detail.dateOfBirthLabel')}: ${toDateOnly(dob)}`;
      return '';
    },
    getInitialValues: (record, context) => ({
      first_name: sanitizeString(record?.first_name),
      last_name: sanitizeString(record?.last_name),
      date_of_birth: toDateOnly(record?.date_of_birth),
      gender: sanitizeString(record?.gender),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      is_active: record?.is_active !== false,
    }),
    toPayload: (values) => ({
      first_name: sanitizeString(values.first_name),
      last_name: sanitizeString(values.last_name),
      date_of_birth: toIsoDateTime(values.date_of_birth),
      gender: sanitizeString(values.gender) || undefined,
      facility_id: sanitizeString(values.facility_id) || undefined,
      is_active: values.is_active !== false,
    }),
    detailRows: [
      { labelKey: 'patients.resources.patients.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.patients.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.patients.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'patients.resources.patients.detail.firstNameLabel', valueKey: 'first_name' },
      { labelKey: 'patients.resources.patients.detail.lastNameLabel', valueKey: 'last_name' },
      { labelKey: 'patients.resources.patients.detail.dateOfBirthLabel', valueKey: 'date_of_birth' },
      { labelKey: 'patients.resources.patients.detail.genderLabel', valueKey: 'gender' },
      { labelKey: 'patients.resources.patients.detail.activeLabel', valueKey: 'is_active', type: 'boolean' },
      { labelKey: 'patients.resources.patients.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.patients.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.PATIENT_IDENTIFIERS]: {
    id: PATIENT_RESOURCE_IDS.PATIENT_IDENTIFIERS,
    routePath: `${PATIENT_ROUTE_ROOT}/patient-identifiers`,
    i18nKey: 'patients.resources.patientIdentifiers',
    supportsPatientFilter: true,
    requiresPatientSelection: true,
    allowListWithoutPatientContext: true,
    allowCreateWithoutPatientContext: true,
    allowEditWithoutPatientContext: true,
    resolvePatientLabels: true,
    hidePatientSelectorOnEdit: true,
    hidePatientSelectorWhenContextProvided: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'identifier_type',
        type: 'text',
        required: true,
        maxLength: 80,
        labelKey: 'patients.resources.patientIdentifiers.form.identifierTypeLabel',
        placeholderKey: 'patients.resources.patientIdentifiers.form.identifierTypePlaceholder',
        hintKey: 'patients.resources.patientIdentifiers.form.identifierTypeHint',
      },
      {
        name: 'identifier_value',
        type: 'text',
        required: true,
        maxLength: 120,
        labelKey: 'patients.resources.patientIdentifiers.form.identifierValueLabel',
        placeholderKey: 'patients.resources.patientIdentifiers.form.identifierValuePlaceholder',
        hintKey: 'patients.resources.patientIdentifiers.form.identifierValueHint',
      },
      {
        name: 'is_primary',
        type: 'switch',
        required: false,
        labelKey: 'patients.resources.patientIdentifiers.form.primaryLabel',
        hintKey: 'patients.resources.patientIdentifiers.form.primaryHint',
      },
    ],
    getItemTitle: (item) => resolveFirstReadable(
      item?.identifier_value,
      item?.identifier_type
    ),
    getItemSubtitle: (item, t) => {
      const identifierType = sanitizeString(item?.identifier_type);
      const patientLabel = resolveFirstReadable(
        item?.patient_display_label,
        item?.patient_name,
        item?.patient_label
      );
      if (identifierType && patientLabel) {
        return `${t('patients.resources.patientIdentifiers.detail.identifierTypeLabel')}: ${identifierType} | ${t('patients.resources.patientIdentifiers.detail.patientNameLabel')}: ${patientLabel}`;
      }
      if (identifierType) {
        return `${t('patients.resources.patientIdentifiers.detail.identifierTypeLabel')}: ${identifierType}`;
      }
      if (patientLabel) {
        return `${t('patients.resources.patientIdentifiers.detail.patientNameLabel')}: ${patientLabel}`;
      }
      return '';
    },
    getInitialValues: (record) => ({
      identifier_type: sanitizeString(record?.identifier_type),
      identifier_value: sanitizeString(record?.identifier_value),
      is_primary: Boolean(record?.is_primary),
    }),
    toPayload: (values) => ({
      identifier_type: sanitizeString(values.identifier_type),
      identifier_value: sanitizeString(values.identifier_value),
      is_primary: Boolean(values.is_primary),
    }),
    detailRows: [
      { labelKey: 'patients.resources.patientIdentifiers.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.patientNameLabel', valueKey: 'patient_display_label' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.identifierTypeLabel', valueKey: 'identifier_type' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.identifierValueLabel', valueKey: 'identifier_value' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.primaryLabel', valueKey: 'is_primary', type: 'boolean' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.patientIdentifiers.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.PATIENT_CONTACTS]: {
    id: PATIENT_RESOURCE_IDS.PATIENT_CONTACTS,
    routePath: `${PATIENT_ROUTE_ROOT}/patient-contacts`,
    i18nKey: 'patients.resources.patientContacts',
    supportsPatientFilter: true,
    requiresPatientSelection: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'contact_type',
        type: 'select',
        required: true,
        labelKey: 'patients.resources.patientContacts.form.contactTypeLabel',
        placeholderKey: 'patients.resources.patientContacts.form.contactTypePlaceholder',
        hintKey: 'patients.resources.patientContacts.form.contactTypeHint',
        options: [
          { value: 'PHONE', labelKey: 'patients.resources.patientContacts.options.contactType.phone' },
          { value: 'EMAIL', labelKey: 'patients.resources.patientContacts.options.contactType.email' },
          { value: 'FAX', labelKey: 'patients.resources.patientContacts.options.contactType.fax' },
          { value: 'OTHER', labelKey: 'patients.resources.patientContacts.options.contactType.other' },
        ],
      },
      {
        name: 'value',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'patients.resources.patientContacts.form.valueLabel',
        placeholderKey: 'patients.resources.patientContacts.form.valuePlaceholder',
        hintKey: 'patients.resources.patientContacts.form.valueHint',
      },
      {
        name: 'is_primary',
        type: 'switch',
        required: false,
        labelKey: 'patients.resources.patientContacts.form.primaryLabel',
        hintKey: 'patients.resources.patientContacts.form.primaryHint',
      },
    ],
    getItemTitle: (item) => resolveFirstReadable(
      item?.value,
      item?.contact_type
    ),
    getItemSubtitle: (item, t) => {
      const contactType = sanitizeReadable(item?.contact_type);
      if (!contactType) return '';
      return `${t('patients.resources.patientContacts.detail.contactTypeLabel')}: ${contactType}`;
    },
    getInitialValues: (record) => ({
      contact_type: sanitizeString(record?.contact_type),
      value: sanitizeString(record?.value),
      is_primary: Boolean(record?.is_primary),
    }),
    toPayload: (values) => ({
      contact_type: sanitizeString(values.contact_type),
      value: sanitizeString(values.value),
      is_primary: Boolean(values.is_primary),
    }),
    detailRows: [
      { labelKey: 'patients.resources.patientContacts.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.patientContacts.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.patientContacts.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'patients.resources.patientContacts.detail.contactTypeLabel', valueKey: 'contact_type' },
      { labelKey: 'patients.resources.patientContacts.detail.valueLabel', valueKey: 'value' },
      { labelKey: 'patients.resources.patientContacts.detail.primaryLabel', valueKey: 'is_primary', type: 'boolean' },
      { labelKey: 'patients.resources.patientContacts.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.patientContacts.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.PATIENT_GUARDIANS]: {
    id: PATIENT_RESOURCE_IDS.PATIENT_GUARDIANS,
    routePath: `${PATIENT_ROUTE_ROOT}/patient-guardians`,
    i18nKey: 'patients.resources.patientGuardians',
    supportsPatientFilter: true,
    requiresPatientSelection: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'patients.resources.patientGuardians.form.nameLabel',
        placeholderKey: 'patients.resources.patientGuardians.form.namePlaceholder',
        hintKey: 'patients.resources.patientGuardians.form.nameHint',
      },
      {
        name: 'relationship',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'patients.resources.patientGuardians.form.relationshipLabel',
        placeholderKey: 'patients.resources.patientGuardians.form.relationshipPlaceholder',
        hintKey: 'patients.resources.patientGuardians.form.relationshipHint',
      },
      {
        name: 'phone',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'patients.resources.patientGuardians.form.phoneLabel',
        placeholderKey: 'patients.resources.patientGuardians.form.phonePlaceholder',
        hintKey: 'patients.resources.patientGuardians.form.phoneHint',
      },
      {
        name: 'email',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'patients.resources.patientGuardians.form.emailLabel',
        placeholderKey: 'patients.resources.patientGuardians.form.emailPlaceholder',
        hintKey: 'patients.resources.patientGuardians.form.emailHint',
      },
    ],
    getItemTitle: (item) => resolveFirstReadable(
      item?.name,
      item?.relationship,
      item?.email,
      item?.phone
    ),
    getItemSubtitle: (item, t) => {
      const relationship = sanitizeReadable(item?.relationship);
      if (!relationship) return '';
      return `${t('patients.resources.patientGuardians.detail.relationshipLabel')}: ${relationship}`;
    },
    getInitialValues: (record) => ({
      name: sanitizeString(record?.name),
      relationship: sanitizeString(record?.relationship),
      phone: sanitizeString(record?.phone),
      email: sanitizeString(record?.email),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      relationship: sanitizeString(values.relationship) || undefined,
      phone: sanitizeString(values.phone) || undefined,
      email: sanitizeString(values.email) || undefined,
    }),
    detailRows: [
      { labelKey: 'patients.resources.patientGuardians.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.patientGuardians.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.patientGuardians.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'patients.resources.patientGuardians.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'patients.resources.patientGuardians.detail.relationshipLabel', valueKey: 'relationship' },
      { labelKey: 'patients.resources.patientGuardians.detail.phoneLabel', valueKey: 'phone' },
      { labelKey: 'patients.resources.patientGuardians.detail.emailLabel', valueKey: 'email' },
      { labelKey: 'patients.resources.patientGuardians.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.patientGuardians.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.PATIENT_ALLERGIES]: {
    id: PATIENT_RESOURCE_IDS.PATIENT_ALLERGIES,
    routePath: `${PATIENT_ROUTE_ROOT}/patient-allergies`,
    i18nKey: 'patients.resources.patientAllergies',
    supportsPatientFilter: true,
    requiresPatientSelection: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'allergen',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'patients.resources.patientAllergies.form.allergenLabel',
        placeholderKey: 'patients.resources.patientAllergies.form.allergenPlaceholder',
        hintKey: 'patients.resources.patientAllergies.form.allergenHint',
      },
      {
        name: 'severity',
        type: 'select',
        required: true,
        labelKey: 'patients.resources.patientAllergies.form.severityLabel',
        placeholderKey: 'patients.resources.patientAllergies.form.severityPlaceholder',
        hintKey: 'patients.resources.patientAllergies.form.severityHint',
        options: [
          { value: 'MILD', labelKey: 'patients.resources.patientAllergies.options.severity.mild' },
          { value: 'MODERATE', labelKey: 'patients.resources.patientAllergies.options.severity.moderate' },
          { value: 'SEVERE', labelKey: 'patients.resources.patientAllergies.options.severity.severe' },
        ],
      },
      {
        name: 'reaction',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'patients.resources.patientAllergies.form.reactionLabel',
        placeholderKey: 'patients.resources.patientAllergies.form.reactionPlaceholder',
        hintKey: 'patients.resources.patientAllergies.form.reactionHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 500,
        labelKey: 'patients.resources.patientAllergies.form.notesLabel',
        placeholderKey: 'patients.resources.patientAllergies.form.notesPlaceholder',
        hintKey: 'patients.resources.patientAllergies.form.notesHint',
      },
    ],
    getItemTitle: (item) => resolveFirstReadable(
      item?.allergen,
      item?.severity
    ),
    getItemSubtitle: (item, t) => {
      const severity = sanitizeString(item?.severity);
      if (!severity) return '';
      return `${t('patients.resources.patientAllergies.detail.severityLabel')}: ${severity}`;
    },
    getInitialValues: (record) => ({
      allergen: sanitizeString(record?.allergen),
      severity: sanitizeString(record?.severity),
      reaction: sanitizeString(record?.reaction),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      allergen: sanitizeString(values.allergen),
      severity: sanitizeString(values.severity),
      reaction: sanitizeString(values.reaction) || undefined,
      notes: sanitizeString(values.notes) || undefined,
    }),
    detailRows: [
      { labelKey: 'patients.resources.patientAllergies.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.patientAllergies.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.patientAllergies.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'patients.resources.patientAllergies.detail.allergenLabel', valueKey: 'allergen' },
      { labelKey: 'patients.resources.patientAllergies.detail.severityLabel', valueKey: 'severity' },
      { labelKey: 'patients.resources.patientAllergies.detail.reactionLabel', valueKey: 'reaction' },
      { labelKey: 'patients.resources.patientAllergies.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'patients.resources.patientAllergies.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.patientAllergies.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.PATIENT_MEDICAL_HISTORIES]: {
    id: PATIENT_RESOURCE_IDS.PATIENT_MEDICAL_HISTORIES,
    routePath: `${PATIENT_ROUTE_ROOT}/patient-medical-histories`,
    i18nKey: 'patients.resources.patientMedicalHistories',
    supportsPatientFilter: true,
    requiresPatientSelection: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'condition',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'patients.resources.patientMedicalHistories.form.conditionLabel',
        placeholderKey: 'patients.resources.patientMedicalHistories.form.conditionPlaceholder',
        hintKey: 'patients.resources.patientMedicalHistories.form.conditionHint',
      },
      {
        name: 'diagnosis_date',
        type: 'text',
        required: false,
        maxLength: 20,
        labelKey: 'patients.resources.patientMedicalHistories.form.diagnosedOnLabel',
        placeholderKey: 'patients.resources.patientMedicalHistories.form.diagnosedOnPlaceholder',
        hintKey: 'patients.resources.patientMedicalHistories.form.diagnosedOnHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 500,
        labelKey: 'patients.resources.patientMedicalHistories.form.notesLabel',
        placeholderKey: 'patients.resources.patientMedicalHistories.form.notesPlaceholder',
        hintKey: 'patients.resources.patientMedicalHistories.form.notesHint',
      },
    ],
    getItemTitle: (item) => resolveFirstReadable(
      item?.condition,
      item?.diagnosis_date
    ),
    getItemSubtitle: (item, t) => {
      const diagnosedOn = toDateOnly(item?.diagnosis_date);
      if (!diagnosedOn) return '';
      return `${t('patients.resources.patientMedicalHistories.detail.diagnosedOnLabel')}: ${diagnosedOn}`;
    },
    getInitialValues: (record) => ({
      condition: sanitizeString(record?.condition),
      diagnosis_date: toDateOnly(record?.diagnosis_date),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      condition: sanitizeString(values.condition),
      diagnosis_date: toDateOnly(values.diagnosis_date) || undefined,
      notes: sanitizeString(values.notes) || undefined,
    }),
    detailRows: [
      { labelKey: 'patients.resources.patientMedicalHistories.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.patientMedicalHistories.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.patientMedicalHistories.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'patients.resources.patientMedicalHistories.detail.conditionLabel', valueKey: 'condition' },
      { labelKey: 'patients.resources.patientMedicalHistories.detail.diagnosedOnLabel', valueKey: 'diagnosis_date' },
      { labelKey: 'patients.resources.patientMedicalHistories.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'patients.resources.patientMedicalHistories.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.patientMedicalHistories.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.PATIENT_DOCUMENTS]: {
    id: PATIENT_RESOURCE_IDS.PATIENT_DOCUMENTS,
    routePath: `${PATIENT_ROUTE_ROOT}/patient-documents`,
    i18nKey: 'patients.resources.patientDocuments',
    supportsPatientFilter: true,
    requiresPatientSelection: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'document_type',
        type: 'text',
        required: true,
        maxLength: 120,
        labelKey: 'patients.resources.patientDocuments.form.documentTypeLabel',
        placeholderKey: 'patients.resources.patientDocuments.form.documentTypePlaceholder',
        hintKey: 'patients.resources.patientDocuments.form.documentTypeHint',
      },
      {
        name: 'storage_key',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'patients.resources.patientDocuments.form.storageKeyLabel',
        placeholderKey: 'patients.resources.patientDocuments.form.storageKeyPlaceholder',
        hintKey: 'patients.resources.patientDocuments.form.storageKeyHint',
      },
      {
        name: 'file_name',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'patients.resources.patientDocuments.form.fileNameLabel',
        placeholderKey: 'patients.resources.patientDocuments.form.fileNamePlaceholder',
        hintKey: 'patients.resources.patientDocuments.form.fileNameHint',
      },
      {
        name: 'content_type',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'patients.resources.patientDocuments.form.contentTypeLabel',
        placeholderKey: 'patients.resources.patientDocuments.form.contentTypePlaceholder',
        hintKey: 'patients.resources.patientDocuments.form.contentTypeHint',
      },
    ],
    getItemTitle: (item) =>
      resolveFirstReadable(
        item?.file_name,
        item?.document_type,
        item?.content_type
      ),
    getItemSubtitle: (item, t) => {
      const documentType = sanitizeString(item?.document_type);
      if (!documentType) return '';
      return `${t('patients.resources.patientDocuments.detail.documentTypeLabel')}: ${documentType}`;
    },
    getInitialValues: (record) => ({
      document_type: sanitizeString(record?.document_type),
      storage_key: sanitizeString(record?.storage_key),
      file_name: sanitizeString(record?.file_name),
      content_type: sanitizeString(record?.content_type),
    }),
    toPayload: (values) => ({
      document_type: sanitizeString(values.document_type),
      storage_key: sanitizeString(values.storage_key),
      file_name: sanitizeString(values.file_name) || undefined,
      content_type: sanitizeString(values.content_type) || undefined,
    }),
    detailRows: [
      { labelKey: 'patients.resources.patientDocuments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.patientDocuments.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.patientDocuments.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'patients.resources.patientDocuments.detail.documentTypeLabel', valueKey: 'document_type' },
      { labelKey: 'patients.resources.patientDocuments.detail.storageKeyLabel', valueKey: 'storage_key' },
      { labelKey: 'patients.resources.patientDocuments.detail.fileNameLabel', valueKey: 'file_name' },
      { labelKey: 'patients.resources.patientDocuments.detail.contentTypeLabel', valueKey: 'content_type' },
      { labelKey: 'patients.resources.patientDocuments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.patientDocuments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.CONSENTS]: {
    id: PATIENT_RESOURCE_IDS.CONSENTS,
    routePath: `${PATIENT_ROUTE_ROOT}/consents`,
    i18nKey: 'patients.resources.consents',
    supportsPatientFilter: true,
    requiresPatientSelection: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'consent_type',
        type: 'select',
        required: true,
        labelKey: 'patients.resources.consents.form.consentTypeLabel',
        placeholderKey: 'patients.resources.consents.form.consentTypePlaceholder',
        hintKey: 'patients.resources.consents.form.consentTypeHint',
        options: [
          { value: 'TREATMENT', labelKey: 'patients.resources.consents.options.consentType.treatment' },
          { value: 'DATA_SHARING', labelKey: 'patients.resources.consents.options.consentType.dataSharing' },
          { value: 'RESEARCH', labelKey: 'patients.resources.consents.options.consentType.research' },
          { value: 'BILLING', labelKey: 'patients.resources.consents.options.consentType.billing' },
          { value: 'OTHER', labelKey: 'patients.resources.consents.options.consentType.other' },
        ],
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'patients.resources.consents.form.statusLabel',
        placeholderKey: 'patients.resources.consents.form.statusPlaceholder',
        hintKey: 'patients.resources.consents.form.statusHint',
        options: [
          { value: 'GRANTED', labelKey: 'patients.resources.consents.options.status.granted' },
          { value: 'REVOKED', labelKey: 'patients.resources.consents.options.status.revoked' },
          { value: 'PENDING', labelKey: 'patients.resources.consents.options.status.pending' },
        ],
      },
      {
        name: 'granted_at',
        type: 'text',
        required: false,
        maxLength: 32,
        labelKey: 'patients.resources.consents.form.grantedAtLabel',
        placeholderKey: 'patients.resources.consents.form.grantedAtPlaceholder',
        hintKey: 'patients.resources.consents.form.grantedAtHint',
      },
      {
        name: 'revoked_at',
        type: 'text',
        required: false,
        maxLength: 32,
        labelKey: 'patients.resources.consents.form.revokedAtLabel',
        placeholderKey: 'patients.resources.consents.form.revokedAtPlaceholder',
        hintKey: 'patients.resources.consents.form.revokedAtHint',
      },
    ],
    getItemTitle: (item) => resolveFirstReadable(
      item?.consent_type,
      item?.status
    ),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('patients.resources.consents.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record) => ({
      consent_type: sanitizeString(record?.consent_type),
      status: sanitizeString(record?.status),
      granted_at: toDateOnly(record?.granted_at),
      revoked_at: toDateOnly(record?.revoked_at),
    }),
    toPayload: (values) => ({
      consent_type: sanitizeString(values.consent_type),
      status: sanitizeString(values.status),
      granted_at: toIsoDateTime(values.granted_at) || undefined,
      revoked_at: toIsoDateTime(values.revoked_at) || undefined,
    }),
    detailRows: [
      { labelKey: 'patients.resources.consents.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.consents.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.consents.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'patients.resources.consents.detail.consentTypeLabel', valueKey: 'consent_type' },
      { labelKey: 'patients.resources.consents.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'patients.resources.consents.detail.grantedAtLabel', valueKey: 'granted_at', type: 'datetime' },
      { labelKey: 'patients.resources.consents.detail.revokedAtLabel', valueKey: 'revoked_at', type: 'datetime' },
      { labelKey: 'patients.resources.consents.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.consents.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [PATIENT_RESOURCE_IDS.TERMS_ACCEPTANCES]: {
    id: PATIENT_RESOURCE_IDS.TERMS_ACCEPTANCES,
    routePath: `${PATIENT_ROUTE_ROOT}/terms-acceptances`,
    i18nKey: 'patients.resources.termsAcceptances',
    supportsPatientFilter: false,
    requiresPatientSelection: false,
    supportsEdit: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'patients.resources.termsAcceptances.form.userLabel',
        placeholderKey: 'patients.resources.termsAcceptances.form.userPlaceholder',
        hintKey: 'patients.resources.termsAcceptances.form.userHint',
      },
      {
        name: 'version_label',
        type: 'text',
        required: true,
        maxLength: 40,
        labelKey: 'patients.resources.termsAcceptances.form.versionLabel',
        placeholderKey: 'patients.resources.termsAcceptances.form.versionPlaceholder',
        hintKey: 'patients.resources.termsAcceptances.form.versionHint',
      },
    ],
    getItemTitle: (item) => resolveFirstReadable(
      item?.version_label,
      item?.user_id
    ),
    getItemSubtitle: (item, t) => {
      const userId = sanitizeString(item?.user_id);
      if (!userId) return '';
      return `${t('patients.resources.termsAcceptances.detail.userLabel')}: ${userId}`;
    },
    getInitialValues: (record) => ({
      user_id: sanitizeString(record?.user_id),
      version_label: sanitizeString(record?.version_label),
    }),
    toPayload: (values) => ({
      user_id: sanitizeString(values.user_id),
      version_label: sanitizeString(values.version_label),
    }),
    detailRows: [
      { labelKey: 'patients.resources.termsAcceptances.detail.idLabel', valueKey: 'id' },
      { labelKey: 'patients.resources.termsAcceptances.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'patients.resources.termsAcceptances.detail.userLabel', valueKey: 'user_id' },
      { labelKey: 'patients.resources.termsAcceptances.detail.versionLabel', valueKey: 'version_label' },
      { labelKey: 'patients.resources.termsAcceptances.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'patients.resources.termsAcceptances.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
};

const getPatientResourceConfig = (resourceId) => resourceConfigs[resourceId] || null;

export {
  PATIENT_RESOURCE_IDS,
  PATIENT_RESOURCE_LIST_ORDER,
  PATIENT_ROUTE_ROOT,
  getPatientResourceConfig,
  normalizeRouteId,
  normalizeSearchParam,
  sanitizeString,
  withPatientContext,
};
