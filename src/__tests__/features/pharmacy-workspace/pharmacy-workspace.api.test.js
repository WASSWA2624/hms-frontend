import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { pharmacyWorkspaceApi } from '@features/pharmacy-workspace/pharmacy-workspace.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => ''),
}));

describe('pharmacy-workspace.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiClient.mockResolvedValue({ data: {} });
  });

  it('lists workbench and inventory stock payloads', async () => {
    buildQueryString.mockReturnValue('?page=1&limit=20');
    await pharmacyWorkspaceApi.listWorkbench({ page: 1, limit: 20 });
    await pharmacyWorkspaceApi.listInventoryStock({ page: 1, limit: 20 });

    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PHARMACY_WORKSPACE.WORKBENCH}?page=1&limit=20`,
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PHARMACY_WORKSPACE.INVENTORY_STOCK}?page=1&limit=20`,
      method: 'GET',
    });
  });

  it('loads workflow and resolver payloads', async () => {
    await pharmacyWorkspaceApi.getOrderWorkflow('PHO-001');
    await pharmacyWorkspaceApi.resolveLegacyRoute('pharmacy-orders', 'PHO-001');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_WORKSPACE.ORDER_WORKFLOW('PHO-001'),
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_WORKSPACE.RESOLVE_LEGACY('pharmacy-orders', 'PHO-001'),
      method: 'GET',
    });
  });

  it('posts dispense and inventory actions', async () => {
    const payload = { reason: 'ok' };
    await pharmacyWorkspaceApi.prepareDispense('PHO-001', payload);
    await pharmacyWorkspaceApi.attestDispense('PHO-001', payload);
    await pharmacyWorkspaceApi.cancelOrder('PHO-001', payload);
    await pharmacyWorkspaceApi.returnOrder('PHO-001', { items: [{ order_item_id: 'POI-001', quantity: 1 }] });
    await pharmacyWorkspaceApi.adjustInventory({
      inventory_item_id: 'INV-001',
      quantity_delta: 1,
      reason: 'PURCHASE',
    });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_WORKSPACE.PREPARE_DISPENSE('PHO-001'),
      method: 'POST',
      body: payload,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_WORKSPACE.ATTEST_DISPENSE('PHO-001'),
      method: 'POST',
      body: payload,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_WORKSPACE.CANCEL_ORDER('PHO-001'),
      method: 'POST',
      body: payload,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_WORKSPACE.RETURN_ORDER('PHO-001'),
      method: 'POST',
      body: { items: [{ order_item_id: 'POI-001', quantity: 1 }] },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_WORKSPACE.ADJUST_INVENTORY,
      method: 'POST',
      body: {
        inventory_item_id: 'INV-001',
        quantity_delta: 1,
        reason: 'PURCHASE',
      },
    });
  });
});
