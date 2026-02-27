import { handleError } from '@errors';
import { pharmacyWorkspaceApi } from './pharmacy-workspace.api';
import {
  normalizeInventoryStockPayload,
  normalizePharmacyLegacyResolution,
  normalizePharmacyWorkbenchPayload,
  normalizePharmacyWorkflowPayload,
} from './pharmacy-workspace.model';
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
} from './pharmacy-workspace.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPharmacyWorkbench = async (params = {}) =>
  execute(async () => {
    const parsed = parsePharmacyWorkbenchListParams(params);
    const response = await pharmacyWorkspaceApi.listWorkbench(parsed);
    return normalizePharmacyWorkbenchPayload(response.data);
  });

const getPharmacyOrderWorkflow = async (id) =>
  execute(async () => {
    const parsedId = parsePharmacyWorkspaceId(id);
    const response = await pharmacyWorkspaceApi.getOrderWorkflow(parsedId);
    return normalizePharmacyWorkflowPayload(response.data);
  });

const resolvePharmacyLegacyRoute = async (resource, id) =>
  execute(async () => {
    const parsed = parseResolvePharmacyLegacyRouteParams({ resource, id });
    const response = await pharmacyWorkspaceApi.resolveLegacyRoute(parsed.resource, parsed.id);
    return normalizePharmacyLegacyResolution(response.data);
  });

const preparePharmacyDispense = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parsePharmacyWorkspaceId(id);
    const parsedPayload = parsePrepareDispensePayload(payload);
    const response = await pharmacyWorkspaceApi.prepareDispense(parsedId, parsedPayload);
    return {
      workflow: normalizePharmacyWorkflowPayload(response.data?.workflow),
      dispense_batch_ref: response.data?.dispense_batch_ref || null,
    };
  });

const attestPharmacyDispense = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parsePharmacyWorkspaceId(id);
    const parsedPayload = parseAttestDispensePayload(payload);
    const response = await pharmacyWorkspaceApi.attestDispense(parsedId, parsedPayload);
    return {
      workflow: normalizePharmacyWorkflowPayload(response.data?.workflow),
      dispense_batch_ref: response.data?.dispense_batch_ref || null,
    };
  });

const cancelPharmacyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parsePharmacyWorkspaceId(id);
    const parsedPayload = parseCancelOrderPayload(payload);
    const response = await pharmacyWorkspaceApi.cancelOrder(parsedId, parsedPayload);
    return {
      workflow: normalizePharmacyWorkflowPayload(response.data?.workflow),
    };
  });

const returnPharmacyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parsePharmacyWorkspaceId(id);
    const parsedPayload = parseReturnOrderPayload(payload);
    const response = await pharmacyWorkspaceApi.returnOrder(parsedId, parsedPayload);
    return {
      workflow: normalizePharmacyWorkflowPayload(response.data?.workflow),
    };
  });

const listPharmacyInventoryStock = async (params = {}) =>
  execute(async () => {
    const parsed = parseInventoryStockListParams(params);
    const response = await pharmacyWorkspaceApi.listInventoryStock(parsed);
    return normalizeInventoryStockPayload(response.data);
  });

const adjustPharmacyInventoryStock = async (payload = {}) =>
  execute(async () => {
    const parsedPayload = parseAdjustInventoryPayload(payload);
    const response = await pharmacyWorkspaceApi.adjustInventory(parsedPayload);
    return {
      stock: response.data?.stock || null,
      movement: response.data?.movement || null,
    };
  });

export {
  listPharmacyWorkbench,
  getPharmacyOrderWorkflow,
  resolvePharmacyLegacyRoute,
  preparePharmacyDispense,
  attestPharmacyDispense,
  cancelPharmacyOrder,
  returnPharmacyOrder,
  listPharmacyInventoryStock,
  adjustPharmacyInventoryStock,
  parsePharmacyWorkbenchRouteState,
};
