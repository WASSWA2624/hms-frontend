import {
  adjustPharmacyInventoryStock,
  attestPharmacyDispense,
  cancelPharmacyOrder,
  getPharmacyOrderWorkflow,
  listPharmacyInventoryStock,
  listPharmacyWorkbench,
  preparePharmacyDispense,
  resolvePharmacyLegacyRoute,
  returnPharmacyOrder,
} from '@features/pharmacy-workspace';
import { pharmacyWorkspaceApi } from '@features/pharmacy-workspace/pharmacy-workspace.api';

jest.mock('@features/pharmacy-workspace/pharmacy-workspace.api', () => ({
  pharmacyWorkspaceApi: {
    listWorkbench: jest.fn(),
    getOrderWorkflow: jest.fn(),
    resolveLegacyRoute: jest.fn(),
    prepareDispense: jest.fn(),
    attestDispense: jest.fn(),
    cancelOrder: jest.fn(),
    returnOrder: jest.fn(),
    listInventoryStock: jest.fn(),
    adjustInventory: jest.fn(),
  },
}));

const workflow = {
  order: { id: 'PHO-001', display_id: 'PHO-001', status: 'ORDERED' },
  items: [],
  attestations: [],
  timeline: [],
  next_actions: {
    can_prepare_dispense: true,
    can_attest_dispense: true,
  },
};

describe('pharmacy-workspace.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pharmacyWorkspaceApi.listWorkbench.mockResolvedValue({
      data: { summary: { total_orders: 1 }, worklist: [workflow.order], pagination: { page: 1 } },
    });
    pharmacyWorkspaceApi.getOrderWorkflow.mockResolvedValue({ data: workflow });
    pharmacyWorkspaceApi.resolveLegacyRoute.mockResolvedValue({
      data: {
        resource: 'orders',
        identifier: 'PHO-001',
        route: '/pharmacy/orders/PHO-001',
        matched_by: 'human_friendly_id',
      },
    });
    pharmacyWorkspaceApi.prepareDispense.mockResolvedValue({
      data: { workflow, dispense_batch_ref: 'DSP-1' },
    });
    pharmacyWorkspaceApi.attestDispense.mockResolvedValue({
      data: { workflow, dispense_batch_ref: 'DSP-1' },
    });
    pharmacyWorkspaceApi.cancelOrder.mockResolvedValue({ data: { workflow } });
    pharmacyWorkspaceApi.returnOrder.mockResolvedValue({ data: { workflow } });
    pharmacyWorkspaceApi.listInventoryStock.mockResolvedValue({
      data: {
        summary: { total_stock_rows: 1, low_stock_rows: 0 },
        stocks: [{ id: 'STK-1', display_id: 'STK-1', quantity: 4, reorder_level: 2 }],
        pagination: { page: 1 },
      },
    });
    pharmacyWorkspaceApi.adjustInventory.mockResolvedValue({
      data: {
        stock: { id: 'STK-1' },
        movement: { id: 'MOV-1' },
      },
    });
  });

  it('lists and loads workflow payload', async () => {
    const list = await listPharmacyWorkbench({ page: '1', limit: '20' });
    const detail = await getPharmacyOrderWorkflow('PHO-001');

    expect(pharmacyWorkspaceApi.listWorkbench).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });
    expect(list.worklist[0].id).toBe('PHO-001');
    expect(pharmacyWorkspaceApi.getOrderWorkflow).toHaveBeenCalledWith('PHO-001');
    expect(detail.order?.id).toBe('PHO-001');
  });

  it('resolves legacy routes and runs dispense actions', async () => {
    const legacy = await resolvePharmacyLegacyRoute('pharmacy-orders', 'PHO-001');
    expect(legacy.route).toBe('/pharmacy/orders/PHO-001');

    await preparePharmacyDispense('PHO-001', {
      items: [{ order_item_id: 'POI-001', quantity: 2 }],
    });
    await attestPharmacyDispense('PHO-001', { dispense_batch_ref: 'DSP-1' });
    await cancelPharmacyOrder('PHO-001', { reason: 'Patient request' });
    await returnPharmacyOrder('PHO-001', {
      items: [{ order_item_id: 'POI-001', quantity: 1 }],
    });

    expect(pharmacyWorkspaceApi.prepareDispense).toHaveBeenCalled();
    expect(pharmacyWorkspaceApi.attestDispense).toHaveBeenCalled();
    expect(pharmacyWorkspaceApi.cancelOrder).toHaveBeenCalled();
    expect(pharmacyWorkspaceApi.returnOrder).toHaveBeenCalled();
  });

  it('loads and adjusts inventory stock payload', async () => {
    const list = await listPharmacyInventoryStock({ page: '1', limit: '20' });
    const updated = await adjustPharmacyInventoryStock({
      inventory_item_id: 'INV-1',
      quantity_delta: 3,
      reason: 'PURCHASE',
    });

    expect(pharmacyWorkspaceApi.listInventoryStock).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });
    expect(list.stocks[0].id).toBe('STK-1');
    expect(pharmacyWorkspaceApi.adjustInventory).toHaveBeenCalledWith({
      inventory_item_id: 'INV-1',
      quantity_delta: 3,
      reason: 'PURCHASE',
    });
    expect(updated.stock).toEqual({ id: 'STK-1' });
    expect(updated.movement).toEqual({ id: 'MOV-1' });
  });
});
