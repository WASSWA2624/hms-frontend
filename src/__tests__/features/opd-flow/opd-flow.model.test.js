/**
 * OPD Flow Model Tests
 * File: opd-flow.model.test.js
 */
import {
  normalizeFlowMetadata,
  normalizeOpdFlowList,
  normalizeOpdFlowSnapshot,
} from '@features/opd-flow';

describe('opd-flow.model', () => {
  it('normalizes flow metadata and timeline', () => {
    const flow = normalizeFlowMetadata({
      stage: 'WAITING_VITALS',
      next_step: 'RECORD_VITALS',
      timeline: [{ event: 'FLOW_STARTED', at: '2026-02-24T08:00:00.000Z', details: null }],
    });

    expect(flow.stage).toBe('WAITING_VITALS');
    expect(flow.next_step).toBe('RECORD_VITALS');
    expect(flow.timeline).toEqual([
      {
        event: 'FLOW_STARTED',
        at: '2026-02-24T08:00:00.000Z',
        by_user_id: null,
        details: {},
      },
    ]);
  });

  it('normalizes OPD flow snapshot from direct flow payload', () => {
    const snapshot = normalizeOpdFlowSnapshot({
      encounter: {
        id: 'enc-1',
        human_friendly_id: 'ENC000001',
        patient_id: 'patient-1',
        patient: { id: 'patient-1', human_friendly_id: 'PAT000001' },
      },
      flow: {
        stage: 'WAITING_CONSULTATION_PAYMENT',
        next_step: 'PAY_CONSULTATION',
        consultation: { invoice_id: 'inv-1', payment_id: 'pay-1' },
        timeline: [],
      },
      visit_queue: { id: 'queue-1', human_friendly_id: 'VQ000001' },
      consultation_invoice: { id: 'inv-1', human_friendly_id: 'INV000001' },
      consultation_payment: { id: 'pay-1', human_friendly_id: 'PAY000001' },
    });

    expect(snapshot.encounter.id).toBe('enc-1');
    expect(snapshot.flow.stage).toBe('WAITING_CONSULTATION_PAYMENT');
    expect(snapshot.linked_record_ids.encounter_id).toBe('ENC000001');
    expect(snapshot.linked_record_ids.consultation_invoice_id).toBe('INV000001');
    expect(snapshot.linked_record_ids.consultation_payment_id).toBe('PAY000001');
    expect(snapshot.linked_record_ids.visit_queue_id).toBe('VQ000001');
  });

  it('normalizes OPD flow snapshot from encounter extension fallback', () => {
    const snapshot = normalizeOpdFlowSnapshot({
      encounter: {
        id: 'enc-2',
        human_friendly_id: 'ENC000002',
        extension_json: {
          opd_flow: {
            stage: 'WAITING_DOCTOR_ASSIGNMENT',
            next_step: 'ASSIGN_DOCTOR',
            timeline: [{ event: 'VITALS_RECORDED', at: '2026-02-24T08:05:00.000Z' }],
          },
        },
      },
    });

    expect(snapshot.flow.stage).toBe('WAITING_DOCTOR_ASSIGNMENT');
    expect(snapshot.timeline).toHaveLength(1);
    expect(snapshot.linked_record_ids.encounter_id).toBe('ENC000002');
  });

  it('normalizes list payload with pagination', () => {
    const result = normalizeOpdFlowList({
      items: [
        {
          encounter: {
            id: 'enc-1',
            human_friendly_id: 'ENC000001',
            patient_id: 'patient-1',
            patient: {
              id: 'patient-1',
              human_friendly_id: 'PAT000001',
            },
          },
          flow: { stage: 'WAITING_VITALS', timeline: [] },
        },
      ],
      pagination: { page: 1, limit: 20, total: 1 },
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('enc-1');
    expect(result.items[0].human_friendly_id).toBe('ENC000001');
    expect(result.items[0].patient_human_friendly_id).toBe('PAT000001');
    expect(result.items[0].stage).toBe('WAITING_VITALS');
    expect(result.pagination).toEqual({ page: 1, limit: 20, total: 1 });
  });

  it('normalizes array list payload', () => {
    const result = normalizeOpdFlowList([
      {
        encounter: { id: 'enc-3', patient_id: 'patient-3' },
        flow: { stage: 'DISCHARGED', timeline: [] },
      },
    ]);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('enc-3');
    expect(result.items[0].stage).toBe('DISCHARGED');
    expect(result.pagination).toBeNull();
  });
});
