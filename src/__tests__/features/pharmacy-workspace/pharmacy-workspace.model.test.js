import {
  normalizeInventoryStockPayload,
  normalizePharmacyLegacyResolution,
  normalizePharmacyWorkbenchPayload,
  normalizePharmacyWorkflowPayload,
} from '@features/pharmacy-workspace';

describe('pharmacy-workspace.model', () => {
  it('normalizes workbench payload and strips uuid-like ids from rendered fields', () => {
    const payload = normalizePharmacyWorkbenchPayload({
      summary: { total_orders: '2', pending_attestations: '1' },
      worklist: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          display_id: 'PHO-001',
          status: 'ordered',
          item_count: '3',
          items: [
            {
              id: '660e8400-e29b-41d4-a716-446655440000',
              display_id: 'POI-001',
              quantity_remaining: '2',
            },
          ],
        },
      ],
      pagination: { page: 1, limit: 20, total: 1 },
    });

    expect(payload.summary.total_orders).toBe(2);
    expect(payload.summary.pending_attestations).toBe(1);
    expect(payload.worklist[0].id).toBe('PHO-001');
    expect(payload.worklist[0].status).toBe('ORDERED');
    expect(payload.worklist[0].items[0].id).toBe('POI-001');
    expect(payload.worklist[0].items[0].quantity_remaining).toBe(2);
  });

  it('normalizes workflow payload ordering and action flags', () => {
    const payload = normalizePharmacyWorkflowPayload({
      order: { id: 'PHO-123', display_id: 'PHO-123', status: 'ordered' },
      timeline: [
        { id: 'older', type: 'ORDERED', at: '2026-02-27T08:00:00.000Z' },
        { id: 'newer', type: 'PREPARE', at: '2026-02-27T09:00:00.000Z' },
      ],
      next_actions: {
        can_prepare_dispense: 1,
        can_attest_dispense: 0,
        can_adjust_inventory: true,
      },
    });

    expect(payload.order?.id).toBe('PHO-123');
    expect(payload.timeline[0].id).toBe('newer');
    expect(payload.timeline[1].id).toBe('older');
    expect(payload.next_actions).toEqual({
      can_prepare_dispense: true,
      can_attest_dispense: false,
      can_cancel: false,
      can_return: false,
      can_adjust_inventory: true,
    });
  });

  it('normalizes inventory stock payload', () => {
    const payload = normalizeInventoryStockPayload({
      summary: { total_stock_rows: '8', low_stock_rows: '2' },
      stocks: [
        {
          id: '770e8400-e29b-41d4-a716-446655440000',
          display_id: 'STK-001',
          quantity: '4',
          reorder_level: '10',
          inventory_item: {
            id: '880e8400-e29b-41d4-a716-446655440000',
            display_id: 'INV-001',
            name: 'Paracetamol',
          },
        },
      ],
      pagination: { page: 1, limit: 30, total: 1 },
    });

    expect(payload.summary.total_stock_rows).toBe(8);
    expect(payload.summary.low_stock_rows).toBe(2);
    expect(payload.stocks[0].id).toBe('STK-001');
    expect(payload.stocks[0].inventory_item.id).toBe('INV-001');
    expect(payload.stocks[0].quantity).toBe(4);
  });

  it('normalizes legacy resolution payload', () => {
    expect(
      normalizePharmacyLegacyResolution({
        resource: 'orders',
        identifier: 'PHO-888',
        route: '/pharmacy/orders/PHO-888',
        matched_by: 'human_friendly_id',
      })
    ).toEqual({
      id: 'PHO-888',
      identifier: 'PHO-888',
      resource: 'orders',
      route: '/pharmacy/orders/PHO-888',
      matched_by: 'human_friendly_id',
    });
  });
});
