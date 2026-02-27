import {
  normalizeRadiologyLegacyResolution,
  normalizeRadiologyWorkbenchPayload,
  normalizeRadiologyWorkflowPayload,
} from '@features/radiology-workspace';

describe('radiology-workspace.model', () => {
  it('normalizes workbench payload and strips uuid-like ids from rendered fields', () => {
    const payload = normalizeRadiologyWorkbenchPayload({
      summary: { total_orders: '3', ordered_queue: '1' },
      worklist: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          display_id: 'RAD-001',
          status: 'ordered',
          modality: 'ct',
          study_count: '2',
          unsynced_study_count: '1',
          imaging_studies: [
            {
              id: '660e8400-e29b-41d4-a716-446655440000',
              display_id: 'STDY-001',
              modality: 'ct',
            },
          ],
          results: [
            {
              id: '770e8400-e29b-41d4-a716-446655440000',
              display_id: 'RSLT-001',
              status: 'draft',
            },
          ],
        },
      ],
      pagination: { page: 1, limit: 20, total: 1 },
    });

    expect(payload.summary.total_orders).toBe(3);
    expect(payload.summary.ordered_queue).toBe(1);
    expect(payload.worklist[0].id).toBe('RAD-001');
    expect(payload.worklist[0].status).toBe('ORDERED');
    expect(payload.worklist[0].modality).toBe('CT');
    expect(payload.worklist[0].imaging_studies[0].id).toBe('STDY-001');
    expect(payload.worklist[0].results[0].id).toBe('RSLT-001');
  });

  it('normalizes workflow payload ordering and action flags', () => {
    const payload = normalizeRadiologyWorkflowPayload({
      order: { id: 'RAD-123', display_id: 'RAD-123', status: 'in_process' },
      timeline: [
        { id: 'older', type: 'ORDERED', at: '2026-02-27T08:00:00.000Z' },
        { id: 'newer', type: 'DRAFT_RESULT', at: '2026-02-27T09:00:00.000Z' },
      ],
      next_actions: {
        can_assign: 1,
        can_start: 0,
        can_complete: true,
        can_pacs_sync: true,
      },
    });

    expect(payload.order?.id).toBe('RAD-123');
    expect(payload.timeline[0].id).toBe('newer');
    expect(payload.timeline[1].id).toBe('older');
    expect(payload.next_actions).toEqual({
      can_assign: true,
      can_start: false,
      can_complete: true,
      can_cancel: false,
      can_create_study: false,
      can_create_draft_result: false,
      can_finalize_result: false,
      can_add_addendum: false,
      can_pacs_sync: true,
    });
  });

  it('normalizes legacy resolution payload', () => {
    expect(
      normalizeRadiologyLegacyResolution({
        resource: 'orders',
        identifier: 'RAD-888',
        route: '/radiology/orders/RAD-888',
        matched_by: 'human_friendly_id',
      })
    ).toEqual({
      id: 'RAD-888',
      identifier: 'RAD-888',
      resource: 'orders',
      route: '/radiology/orders/RAD-888',
      matched_by: 'human_friendly_id',
    });
  });
});

