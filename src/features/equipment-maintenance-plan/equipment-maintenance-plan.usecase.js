/**
 * Equipment Maintenance Plan Use Cases
 * File: equipment-maintenance-plan.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentMaintenancePlanApi } from './equipment-maintenance-plan.api';
import { normalizeEquipmentMaintenancePlan, normalizeEquipmentMaintenancePlanList } from './equipment-maintenance-plan.model';
import {
  parseEquipmentMaintenancePlanId,
  parseEquipmentMaintenancePlanListParams,
  parseEquipmentMaintenancePlanPayload,
} from './equipment-maintenance-plan.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentMaintenancePlans = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentMaintenancePlanListParams(params);
    const response = await equipmentMaintenancePlanApi.list(parsed);
    return normalizeEquipmentMaintenancePlanList(response.data);
  });

const getEquipmentMaintenancePlan = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentMaintenancePlanId(id);
    const response = await equipmentMaintenancePlanApi.get(parsedId);
    return normalizeEquipmentMaintenancePlan(response.data);
  });

const createEquipmentMaintenancePlan = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentMaintenancePlanPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_MAINTENANCE_PLANS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentMaintenancePlan(parsed);
    }
    const response = await equipmentMaintenancePlanApi.create(parsed);
    return normalizeEquipmentMaintenancePlan(response.data);
  });

const updateEquipmentMaintenancePlan = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentMaintenancePlanId(id);
    const parsed = parseEquipmentMaintenancePlanPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_MAINTENANCE_PLANS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentMaintenancePlan({ id: parsedId, ...parsed });
    }
    const response = await equipmentMaintenancePlanApi.update(parsedId, parsed);
    return normalizeEquipmentMaintenancePlan(response.data);
  });

const deleteEquipmentMaintenancePlan = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentMaintenancePlanId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_MAINTENANCE_PLANS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentMaintenancePlan({ id: parsedId });
    }
    const response = await equipmentMaintenancePlanApi.remove(parsedId);
    return normalizeEquipmentMaintenancePlan(response.data);
  });

export {
  listEquipmentMaintenancePlans,
  getEquipmentMaintenancePlan,
  createEquipmentMaintenancePlan,
  updateEquipmentMaintenancePlan,
  deleteEquipmentMaintenancePlan,
};
