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
});
