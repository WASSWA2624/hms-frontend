import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const pharmacyWorkspaceApi = {
  listWorkbench: (params = {}) =>
    apiClient({
      url: `${endpoints.PHARMACY_WORKSPACE.WORKBENCH}${buildQueryString(params)}`,
      method: 'GET',
    }),
  getOrderWorkflow: (id) =>
    apiClient({
      url: endpoints.PHARMACY_WORKSPACE.ORDER_WORKFLOW(id),
      method: 'GET',
    }),
  resolveLegacyRoute: (resource, id) =>
    apiClient({
      url: endpoints.PHARMACY_WORKSPACE.RESOLVE_LEGACY(resource, id),
      method: 'GET',
    }),
  prepareDispense: (id, payload = {}) =>
    apiClient({
      url: endpoints.PHARMACY_WORKSPACE.PREPARE_DISPENSE(id),
      method: 'POST',
      body: payload,
    }),
  attestDispense: (id, payload = {}) =>
    apiClient({
      url: endpoints.PHARMACY_WORKSPACE.ATTEST_DISPENSE(id),
      method: 'POST',
      body: payload,
    }),
  cancelOrder: (id, payload = {}) =>
    apiClient({
      url: endpoints.PHARMACY_WORKSPACE.CANCEL_ORDER(id),
      method: 'POST',
      body: payload,
    }),
  returnOrder: (id, payload = {}) =>
    apiClient({
      url: endpoints.PHARMACY_WORKSPACE.RETURN_ORDER(id),
      method: 'POST',
      body: payload,
    }),
  listInventoryStock: (params = {}) =>
    apiClient({
      url: `${endpoints.PHARMACY_WORKSPACE.INVENTORY_STOCK}${buildQueryString(params)}`,
      method: 'GET',
    }),
  adjustInventory: (payload = {}) =>
    apiClient({
      url: endpoints.PHARMACY_WORKSPACE.ADJUST_INVENTORY,
      method: 'POST',
      body: payload,
    }),
};

export { pharmacyWorkspaceApi };
