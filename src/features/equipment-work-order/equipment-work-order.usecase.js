/**
 * Equipment Work Order Use Cases
 * File: equipment-work-order.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentWorkOrderApi } from './equipment-work-order.api';
import { normalizeEquipmentWorkOrder, normalizeEquipmentWorkOrderList } from './equipment-work-order.model';
import {
  parseEquipmentWorkOrderId,
  parseEquipmentWorkOrderListParams,
  parseEquipmentWorkOrderPayload,
} from './equipment-work-order.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentWorkOrders = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentWorkOrderListParams(params);
    const response = await equipmentWorkOrderApi.list(parsed);
    return normalizeEquipmentWorkOrderList(response.data);
  });

const getEquipmentWorkOrder = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentWorkOrderId(id);
    const response = await equipmentWorkOrderApi.get(parsedId);
    return normalizeEquipmentWorkOrder(response.data);
  });

const createEquipmentWorkOrder = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentWorkOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WORK_ORDERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentWorkOrder(parsed);
    }
    const response = await equipmentWorkOrderApi.create(parsed);
    return normalizeEquipmentWorkOrder(response.data);
  });

const updateEquipmentWorkOrder = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentWorkOrderId(id);
    const parsed = parseEquipmentWorkOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WORK_ORDERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentWorkOrder({ id: parsedId, ...parsed });
    }
    const response = await equipmentWorkOrderApi.update(parsedId, parsed);
    return normalizeEquipmentWorkOrder(response.data);
  });

const deleteEquipmentWorkOrder = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentWorkOrderId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WORK_ORDERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentWorkOrder({ id: parsedId });
    }
    const response = await equipmentWorkOrderApi.remove(parsedId);
    return normalizeEquipmentWorkOrder(response.data);
  });

const startEquipmentWorkOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseEquipmentWorkOrderId(id);
    const parsed = parseEquipmentWorkOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WORK_ORDERS.START(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentWorkOrder({
        id: parsedId,
        status: parsed.status || 'IN_REPAIR',
        ...parsed,
      });
    }
    const response = await equipmentWorkOrderApi.start(parsedId, parsed);
    return normalizeEquipmentWorkOrder(response.data);
  });

const returnToServiceEquipmentWorkOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseEquipmentWorkOrderId(id);
    const parsed = parseEquipmentWorkOrderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WORK_ORDERS.RETURN_TO_SERVICE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentWorkOrder({
        id: parsedId,
        status: parsed.status || 'RETURNED_TO_SERVICE',
        ...parsed,
      });
    }
    const response = await equipmentWorkOrderApi.returnToService(parsedId, parsed);
    return normalizeEquipmentWorkOrder(response.data);
  });

export {
  listEquipmentWorkOrders,
  getEquipmentWorkOrder,
  createEquipmentWorkOrder,
  updateEquipmentWorkOrder,
  deleteEquipmentWorkOrder,
  startEquipmentWorkOrder,
  returnToServiceEquipmentWorkOrder,
};
