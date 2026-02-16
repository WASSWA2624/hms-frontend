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
});
