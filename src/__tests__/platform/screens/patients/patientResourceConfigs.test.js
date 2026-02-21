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

  it('configures consents as patient-linked editable records', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.CONSENTS);

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(true);
    expect(config.supportsPatientFilter).toBe(true);
    expect(config.supportsEdit).not.toBe(false);
  });

  it('configures terms acceptances as read-only for edit action', () => {
    const config = getPatientResourceConfig(PATIENT_RESOURCE_IDS.TERMS_ACCEPTANCES);

    expect(config).toBeTruthy();
    expect(config.requiresPatientSelection).toBe(false);
    expect(config.supportsPatientFilter).toBe(false);
    expect(config.supportsEdit).toBe(false);
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
