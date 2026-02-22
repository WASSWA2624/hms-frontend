import {
  getPatientResourceConfig,
  PATIENT_RESOURCE_IDS,
  PATIENT_RESOURCE_LIST_ORDER,
} from '@platform/screens/patients/patientResourceConfigs';

describe('patientResourceConfigs', () => {
  it('includes consent and terms acceptance resources in tier 4 order', () => {
    const consentIndex = PATIENT_RESOURCE_LIST_ORDER.indexOf(PATIENT_RESOURCE_IDS.CONSENTS);
    const termsIndex = PATIENT_RESOURCE_LIST_ORDER.indexOf(PATIENT_RESOURCE_IDS.TERMS_ACCEPTANCES);

    expect(consentIndex).toBeGreaterThan(-1);
    expect(termsIndex).toBeGreaterThan(-1);
    expect(consentIndex).toBeLessThan(termsIndex);
  });

  it('configures consents for contextless navigation with patient label display', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.CONSENTS);
    const fieldByName = Object.fromEntries((config?.fields || []).map((field) => [field.name, field]));

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(true);
    expect(config.supportsPatientFilter).toBe(true);
    expect(config.allowListWithoutPatientContext).toBe(true);
    expect(config.allowCreateWithoutPatientContext).toBe(true);
    expect(config.allowEditWithoutPatientContext).toBe(true);
    expect(config.hidePatientSelectorOnEdit).toBe(true);
    expect(config.hidePatientSelectorWhenContextProvided).toBe(true);
    expect(config.resolvePatientLabels).toBe(true);
    expect(fieldByName.consent_type?.type).toBe('select');
    expect((fieldByName.consent_type?.options || []).map((option) => option.value)).toEqual([
      'TREATMENT',
      'DATA_SHARING',
      'RESEARCH',
      'BILLING',
      'OTHER',
    ]);
    expect(fieldByName.status?.type).toBe('select');
    expect((fieldByName.status?.options || []).map((option) => option.value)).toEqual([
      'GRANTED',
      'REVOKED',
      'PENDING',
    ]);

    const detailValueKeys = (config.detailRows || []).map((row) => row.valueKey);
    expect(detailValueKeys).toContain('patient_display_label');
  });

  it('configures terms acceptances as read-only with user selector and user label resolution', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.TERMS_ACCEPTANCES);
    const fieldByName = Object.fromEntries((config?.fields || []).map((field) => [field.name, field]));

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(false);
    expect(config.supportsPatientFilter).toBe(false);
    expect(config.supportsEdit).toBe(false);
    expect(config.resolveUserLabels).toBe(true);
    expect(fieldByName.user_id?.type).toBe('select');
    expect(fieldByName.version_label?.type).toBe('text');

    const detailValueKeys = (config.detailRows || []).map((row) => row.valueKey);
    expect(detailValueKeys).toContain('user_display_label');
  });

  it('configures patient identifiers for contextless list navigation and patient label display', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_IDENTIFIERS);

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(true);
    expect(config.allowListWithoutPatientContext).toBe(true);
    expect(config.allowCreateWithoutPatientContext).toBe(true);
    expect(config.hidePatientSelectorOnEdit).toBe(true);
    expect(config.hidePatientSelectorWhenContextProvided).toBe(true);
    expect(config.resolvePatientLabels).toBe(true);

    const detailValueKeys = (config.detailRows || []).map((row) => row.valueKey);
    expect(detailValueKeys).toContain('patient_display_label');
  });

  it('configures patient allergies for contextless navigation and patient label display', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_ALLERGIES);
    const fieldByName = Object.fromEntries((config?.fields || []).map((field) => [field.name, field]));

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(true);
    expect(config.allowListWithoutPatientContext).toBe(true);
    expect(config.allowCreateWithoutPatientContext).toBe(true);
    expect(config.allowEditWithoutPatientContext).toBe(true);
    expect(config.hidePatientSelectorOnEdit).toBe(true);
    expect(config.hidePatientSelectorWhenContextProvided).toBe(true);
    expect(config.resolvePatientLabels).toBe(true);
    expect(fieldByName.severity?.type).toBe('select');
    expect((fieldByName.severity?.options || []).map((option) => option.value)).toEqual([
      'MILD',
      'MODERATE',
      'SEVERE',
    ]);

    const detailValueKeys = (config.detailRows || []).map((row) => row.valueKey);
    expect(detailValueKeys).toContain('patient_display_label');
  });

  it('configures patient medical histories for contextless navigation and patient label display', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_MEDICAL_HISTORIES);
    const fieldByName = Object.fromEntries((config?.fields || []).map((field) => [field.name, field]));

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(true);
    expect(config.allowListWithoutPatientContext).toBe(true);
    expect(config.allowCreateWithoutPatientContext).toBe(true);
    expect(config.allowEditWithoutPatientContext).toBe(true);
    expect(config.hidePatientSelectorOnEdit).toBe(true);
    expect(config.hidePatientSelectorWhenContextProvided).toBe(true);
    expect(config.resolvePatientLabels).toBe(true);
    expect(fieldByName.condition?.type).toBe('text');
    expect(fieldByName.diagnosis_date?.type).toBe('text');
    expect(fieldByName.notes?.type).toBe('text');

    const detailValueKeys = (config.detailRows || []).map((row) => row.valueKey);
    expect(detailValueKeys).toContain('patient_display_label');
  });

  it('configures patient documents for contextless navigation and patient label display', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_DOCUMENTS);
    const fieldByName = Object.fromEntries((config?.fields || []).map((field) => [field.name, field]));

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(true);
    expect(config.allowListWithoutPatientContext).toBe(true);
    expect(config.allowCreateWithoutPatientContext).toBe(true);
    expect(config.allowEditWithoutPatientContext).toBe(true);
    expect(config.hidePatientSelectorOnEdit).toBe(true);
    expect(config.hidePatientSelectorWhenContextProvided).toBe(true);
    expect(config.resolvePatientLabels).toBe(true);
    expect(fieldByName.document_type?.type).toBe('text');
    expect(fieldByName.storage_key?.type).toBe('text');
    expect(fieldByName.file_name?.type).toBe('text');
    expect(fieldByName.content_type?.type).toBe('text');

    const detailValueKeys = (config.detailRows || []).map((row) => row.valueKey);
    expect(detailValueKeys).toContain('patient_display_label');
  });

  it('captures core writable patient fields and uses selector controls for enum/table-backed values', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENTS);
    const fieldByName = Object.fromEntries((config?.fields || []).map((field) => [field.name, field]));

    expect(config).toBeTruthy();
    expect(Object.keys(fieldByName)).toEqual([
      'first_name',
      'last_name',
      'date_of_birth',
      'gender',
      'facility_id',
      'is_active',
    ]);
    expect(fieldByName.first_name.type).toBe('text');
    expect(fieldByName.last_name.type).toBe('text');
    expect(fieldByName.date_of_birth.type).toBe('text');
    expect(fieldByName.gender.type).toBe('select');
    expect(fieldByName.facility_id.type).toBe('select');
    expect(fieldByName.is_active.type).toBe('switch');
  });

  it('keeps system-managed fields out of patient form config', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENTS);
    const fieldNames = (config?.fields || []).map((field) => field.name);

    expect(fieldNames).not.toContain('id');
    expect(fieldNames).not.toContain('created_at');
    expect(fieldNames).not.toContain('updated_at');
    expect(fieldNames).not.toContain('deleted_at');
  });
});
