import {
  parseAdjustInventoryPayload,
  parseAttestDispensePayload,
  parseCancelOrderPayload,
  parseInventoryStockListParams,
  parsePharmacyWorkbenchListParams,
  parsePharmacyWorkbenchRouteState,
  parsePharmacyWorkspaceId,
  parsePrepareDispensePayload,
  parseResolvePharmacyLegacyRouteParams,
  parseReturnOrderPayload,
} from '@features/pharmacy-workspace';

describe('pharmacy-workspace.rules', () => {
  it('parses identifiers and list filters', () => {
    expect(parsePharmacyWorkspaceId('PHO-001')).toBe('PHO-001');
    expect(
      parsePharmacyWorkbenchListParams({
        page: '1',
        limit: '25',
        status: 'ORDERED',
        panel: 'orders',
      })
    ).toEqual({
      page: 1,
      limit: 25,
      status: 'ORDERED',
      panel: 'orders',
    });
    expect(
      parseInventoryStockListParams({
        page: '1',
        limit: '30',
        low_stock_only: 'true',
      })
    ).toEqual({
      page: 1,
      limit: 30,
      low_stock_only: true,
    });
  });

  it('parses route state and legacy resolver params', () => {
    expect(
      parsePharmacyWorkbenchRouteState({
        id: ['PHO-100'],
        panel: 'inventory',
        action: 'adjust',
        resource: 'inventory-items',
        legacyId: 'INV-001',
        patientId: 'PAT-001',
      })
    ).toEqual({
      id: 'PHO-100',
      panel: 'inventory',
      action: 'adjust',
      resource: 'inventory-items',
      legacyId: 'INV-001',
      patientId: 'PAT-001',
      encounterId: undefined,
      inventoryItemId: undefined,
      facilityId: undefined,
    });

    expect(
      parseResolvePharmacyLegacyRouteParams({
        resource: 'pharmacy-orders',
        id: 'PHO-001',
      })
    ).toEqual({
      resource: 'pharmacy-orders',
      id: 'PHO-001',
    });
  });

  it('parses workflow payloads', () => {
    expect(
      parsePrepareDispensePayload({
        dispense_batch_ref: 'DSP-1',
        items: [{ order_item_id: 'POI-1', quantity: 2 }],
      })
    ).toEqual({
      dispense_batch_ref: 'DSP-1',
      items: [{ order_item_id: 'POI-1', quantity: 2 }],
    });
    expect(
      parseAttestDispensePayload({
        dispense_batch_ref: 'DSP-1',
      })
    ).toEqual({
      dispense_batch_ref: 'DSP-1',
    });
    expect(parseCancelOrderPayload({ reason: 'Patient request' })).toEqual({
      reason: 'Patient request',
    });
    expect(
      parseReturnOrderPayload({
        items: [{ order_item_id: 'POI-1', quantity: 1 }],
      })
    ).toEqual({
      items: [{ order_item_id: 'POI-1', quantity: 1 }],
    });
    expect(
      parseAdjustInventoryPayload({
        inventory_item_id: 'INV-1',
        quantity_delta: 3,
        reason: 'PURCHASE',
      })
    ).toEqual({
      inventory_item_id: 'INV-1',
      quantity_delta: 3,
      reason: 'PURCHASE',
    });
  });

  it('rejects unsupported legacy resource', () => {
    expect(() =>
      parseResolvePharmacyLegacyRouteParams({
        resource: 'unknown',
        id: 'PHO-001',
      })
    ).toThrow();
  });
});
