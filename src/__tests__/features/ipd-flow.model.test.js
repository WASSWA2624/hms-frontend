import { normalizeIpdFlowSnapshot } from '@features/ipd-flow';

describe('ipd-flow.model', () => {
  it('strips UUID-like identifiers from display fields', () => {
    const result = normalizeIpdFlowSnapshot({
      id: '550e8400-e29b-41d4-a716-446655440000',
      display_id: 'ADM-1001',
      human_friendly_id: 'ADM-1001',
      patient_display_name: '550e8400-e29b-41d4-a716-446655440000',
      patient: {
        id: '660e8400-e29b-41d4-a716-446655440000',
        human_friendly_id: 'PAT-2001',
        first_name: 'John',
        last_name: 'Doe',
      },
      admission: {
        id: '550e8400-e29b-41d4-a716-446655440000',
      },
      flow: {
        stage: 'ADMITTED_PENDING_BED',
      },
    });

    expect(result.id).toBe('ADM-1001');
    expect(result.admission.id).toBe('ADM-1001');
    expect(result.patient.id).toBe('PAT-2001');
    expect(result.patient_display_name).toBe('John Doe');
  });

  it('normalizes ICU overlay IDs to display identifiers and derives ICU timeline events', () => {
    const result = normalizeIpdFlowSnapshot({
      id: '550e8400-e29b-41d4-a716-446655440000',
      display_id: 'ADM-1001',
      human_friendly_id: 'ADM-1001',
      patient_display_name: 'Jane Doe',
      icu_status: 'ACTIVE',
      critical_severity: 'CRITICAL',
      active_icu_stay_id: 'ICU-STAY-22',
      icu: {
        active_stay: {
          id: '330e8400-e29b-41d4-a716-446655440000',
          display_id: 'ICU-STAY-22',
          admission_id: '550e8400-e29b-41d4-a716-446655440000',
          admission_display_id: 'ADM-1001',
        },
        recent_observations: [
          {
            id: '110e8400-e29b-41d4-a716-446655440000',
            display_id: 'ICU-OBS-7',
            icu_stay_id: '330e8400-e29b-41d4-a716-446655440000',
            icu_stay_display_id: 'ICU-STAY-22',
            observed_at: '2026-02-25T09:15:00.000Z',
            observation: 'Patient sedated and ventilated',
          },
        ],
        recent_alerts: [
          {
            id: '990e8400-e29b-41d4-a716-446655440000',
            display_id: 'ALR-9001',
            icu_stay_id: '330e8400-e29b-41d4-a716-446655440000',
            icu_stay_display_id: 'ICU-STAY-22',
            severity: 'CRITICAL',
            message: 'Airway risk',
            created_at: '2026-02-25T09:20:00.000Z',
          },
        ],
      },
    });

    expect(result.icu.active_stay.id).toBe('ICU-STAY-22');
    expect(result.icu.recent_observations[0].id).toBe('ICU-OBS-7');
    expect(result.icu.recent_observations[0].icu_stay_id).toBe('ICU-STAY-22');
    expect(result.icu.recent_alerts[0].id).toBe('ALR-9001');
    expect(result.critical_severity).toBe('CRITICAL');
    expect(
      result.timeline.some((entry) => entry.type === 'CRITICAL_ALERT')
    ).toBe(true);
    expect(
      result.timeline.some((entry) => entry.type === 'ICU_OBSERVATION')
    ).toBe(true);
  });
});
