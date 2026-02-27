/**
 * Lab Workspace Model Tests
 * File: lab-workspace.model.test.js
 */
import {
  normalizeLabLegacyResolution,
  normalizeLabWorkbenchPayload,
  normalizeLabWorkflowPayload,
} from '@features/lab-workspace';

describe('lab-workspace.model', () => {
  it('normalizes workbench payload and strips UUID-like display IDs', () => {
    const result = normalizeLabWorkbenchPayload({
      summary: {
        total_orders: '3',
        collection_queue: '2',
      },
      worklist: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          display_id: 'LAB-001',
          patient_id: '660e8400-e29b-41d4-a716-446655440000',
          status: 'ordered',
          item_count: '2',
          pending_item_count: 1,
          in_process_item_count: 1,
          completed_item_count: 0,
          sample_count: 1,
          items: [
            {
              id: '770e8400-e29b-41d4-a716-446655440000',
              display_id: 'ITEM-001',
              status: 'in_process',
            },
          ],
          samples: [
            {
              id: '880e8400-e29b-41d4-a716-446655440000',
              display_id: 'SMP-001',
              status: 'pending',
            },
          ],
        },
      ],
      pagination: { page: 1, limit: 50, total: 1 },
    });

    expect(result.summary.total_orders).toBe(3);
    expect(result.summary.collection_queue).toBe(2);
    expect(result.worklist).toHaveLength(1);
    expect(result.worklist[0].id).toBe('LAB-001');
    expect(result.worklist[0].patient_id).toBeNull();
    expect(result.worklist[0].status).toBe('ORDERED');
    expect(result.worklist[0].items[0].id).toBe('ITEM-001');
    expect(result.worklist[0].items[0].status).toBe('IN_PROCESS');
    expect(result.worklist[0].samples[0].id).toBe('SMP-001');
    expect(result.worklist[0].samples[0].status).toBe('PENDING');
    expect(result.pagination).toEqual({ page: 1, limit: 50, total: 1 });
  });

  it('normalizes workflow payload timeline ordering and action booleans', () => {
    const result = normalizeLabWorkflowPayload({
      order: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        display_id: 'LAB-777',
        status: 'in_process',
      },
      results: [
        {
          id: '990e8400-e29b-41d4-a716-446655440000',
          display_id: 'RES-001',
          lab_order_item_id: 'ITEM-002',
          status: 'critical',
        },
      ],
      timeline: [
        { id: 'older', type: 'COLLECTED', at: '2026-02-27T10:00:00.000Z' },
        { id: 'newer', type: 'RECEIVED', at: '2026-02-27T11:00:00.000Z' },
      ],
      next_actions: {
        can_collect: 0,
        can_receive_sample: 1,
        can_release_result: true,
      },
    });

    expect(result.order?.id).toBe('LAB-777');
    expect(result.results[0].id).toBe('RES-001');
    expect(result.results[0].status).toBe('CRITICAL');
    expect(result.timeline[0].id).toBe('newer');
    expect(result.timeline[1].id).toBe('older');
    expect(result.next_actions).toEqual({
      can_collect: false,
      can_receive_sample: true,
      can_release_result: true,
    });
  });

  it('normalizes legacy route resolution payload', () => {
    expect(
      normalizeLabLegacyResolution({
        resource: 'orders',
        identifier: 'LAB-1001',
        route: '/lab/orders/LAB-1001',
        matched_by: 'human_friendly_id',
      })
    ).toEqual({
      id: 'LAB-1001',
      identifier: 'LAB-1001',
      resource: 'orders',
      route: '/lab/orders/LAB-1001',
      matched_by: 'human_friendly_id',
    });
  });
});
