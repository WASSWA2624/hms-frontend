/**
 * OPD Flow Rules Tests
 * File: opd-flow.rules.test.js
 */
import {
  parseAssignDoctorPayload,
  parseDispositionPayload,
  parseDoctorReviewPayload,
  parseOpdFlowId,
  parseOpdFlowListParams,
  parsePayConsultationPayload,
  parseRecordVitalsPayload,
  parseStartOpdFlowPayload,
} from '@features/opd-flow';

describe('opd-flow.rules', () => {
  it('parses ids and list params', () => {
    expect(parseOpdFlowId('flow-1')).toBe('FLOW-1');
    expect(parseOpdFlowListParams({ page: '1', limit: '20', stage: 'WAITING_VITALS' })).toEqual({
      page: 1,
      limit: 20,
      stage: 'WAITING_VITALS',
    });
  });

  it('accepts UUID tenant/facility scope params in list filters', () => {
    expect(
      parseOpdFlowListParams({
        tenant_id: '550e8400-e29b-41d4-a716-446655440000',
        facility_id: '550e8400-e29b-41d4-a716-446655440001',
      })
    ).toEqual({
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      facility_id: '550e8400-e29b-41d4-a716-446655440001',
    });
  });

  it('rejects unsupported stage in list params', () => {
    expect(() => parseOpdFlowListParams({ stage: 'UNKNOWN_STAGE' })).toThrow();
  });

  it('parses walk-in start payload', () => {
    expect(
      parseStartOpdFlowPayload({
        arrival_mode: 'WALK_IN',
        patient_id: 'patient-1',
      })
    ).toMatchObject({
      arrival_mode: 'WALK_IN',
      patient_id: 'PATIENT-1',
    });
  });

  it('accepts UUID tenant/facility scope in start payload', () => {
    expect(
      parseStartOpdFlowPayload({
        tenant_id: '550e8400-e29b-41d4-a716-446655440000',
        facility_id: '550e8400-e29b-41d4-a716-446655440001',
        patient_id: 'patient-1',
      })
    ).toMatchObject({
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      facility_id: '550e8400-e29b-41d4-a716-446655440001',
      patient_id: 'PATIENT-1',
    });
  });

  it('parses online appointment start payload', () => {
    expect(
      parseStartOpdFlowPayload({
        arrival_mode: 'ONLINE_APPOINTMENT',
        appointment_id: 'appointment-1',
      })
    ).toMatchObject({
      arrival_mode: 'ONLINE_APPOINTMENT',
      appointment_id: 'APPOINTMENT-1',
    });
  });

  it('parses emergency start payload with triage alias', () => {
    expect(
      parseStartOpdFlowPayload({
        arrival_mode: 'EMERGENCY',
        patient_registration: { first_name: 'Jane', last_name: 'Doe' },
        emergency: {
          severity: 'HIGH',
          triage_level: 'URGENT',
        },
      })
    ).toMatchObject({
      arrival_mode: 'EMERGENCY',
      emergency: { severity: 'HIGH', triage_level: 'URGENT' },
    });
  });

  it('rejects start payload when patient and appointment context are missing', () => {
    expect(() => parseStartOpdFlowPayload({ arrival_mode: 'WALK_IN' })).toThrow();
  });

  it('rejects online appointment mode without appointment id', () => {
    expect(() =>
      parseStartOpdFlowPayload({
        arrival_mode: 'ONLINE_APPOINTMENT',
        patient_id: 'patient-1',
      })
    ).toThrow();
  });

  it('parses pay consultation payload and enforces method', () => {
    expect(parsePayConsultationPayload({ method: 'CASH' })).toMatchObject({ method: 'CASH' });
    expect(() => parsePayConsultationPayload({})).toThrow();
  });

  it('parses record vitals payload and enforces vitals array', () => {
    expect(
      parseRecordVitalsPayload({
        vitals: [{ vital_type: 'TEMPERATURE', value: '37.1' }],
        triage_level: 'IMMEDIATE',
      })
    ).toMatchObject({
      vitals: [{ vital_type: 'TEMPERATURE', value: '37.1' }],
      triage_level: 'IMMEDIATE',
    });
    expect(() => parseRecordVitalsPayload({ vitals: [] })).toThrow();
    expect(() =>
      parseRecordVitalsPayload({
        vitals: [{ vital_type: 'TEMPERATURE', value: '37.1' }],
        triage_level: 'INVALID_TRIAGE',
      })
    ).toThrow();
  });

  it('parses assign doctor payload and enforces provider id', () => {
    expect(parseAssignDoctorPayload({ provider_user_id: 'doctor-1' })).toEqual({
      provider_user_id: 'DOCTOR-1',
    });
    expect(() => parseAssignDoctorPayload({})).toThrow();
  });

  it('parses doctor review payload with optional arrays', () => {
    expect(
      parseDoctorReviewPayload({
        note: 'Clinical review complete',
        diagnoses: [{ diagnosis_type: 'PRIMARY', description: 'Malaria' }],
        procedures: [{ description: 'Nebulization' }],
        lab_requests: [{ lab_test_id: 'lab-test-1' }],
        radiology_requests: [{ radiology_test_id: 'radiology-test-1' }],
        medications: [{ drug_id: 'drug-1', quantity: 2 }],
      })
    ).toMatchObject({
      note: 'Clinical review complete',
      diagnoses: [{ diagnosis_type: 'PRIMARY', description: 'Malaria' }],
      medications: [{ drug_id: 'DRUG-1', quantity: 2 }],
    });
    expect(() => parseDoctorReviewPayload({})).toThrow();
  });

  it('parses disposition payload and enforces decision enum', () => {
    expect(parseDispositionPayload({ decision: 'DISCHARGE' })).toEqual({
      decision: 'DISCHARGE',
    });
    expect(() => parseDispositionPayload({ decision: 'UNKNOWN' })).toThrow();
  });
});
