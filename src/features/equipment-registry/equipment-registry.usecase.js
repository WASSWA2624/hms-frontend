/**
 * Equipment Registry Use Cases
 * File: equipment-registry.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentRegistryApi } from './equipment-registry.api';
import { normalizeEquipmentRegistry, normalizeEquipmentRegistryList } from './equipment-registry.model';
import {
  parseEquipmentRegistryId,
  parseEquipmentRegistryListParams,
  parseEquipmentRegistryPayload,
} from './equipment-registry.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentRegistries = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentRegistryListParams(params);
    const response = await equipmentRegistryApi.list(parsed);
    return normalizeEquipmentRegistryList(response.data);
  });

const getEquipmentRegistry = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentRegistryId(id);
    const response = await equipmentRegistryApi.get(parsedId);
    return normalizeEquipmentRegistry(response.data);
  });

const createEquipmentRegistry = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentRegistryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_REGISTRIES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentRegistry(parsed);
    }
    const response = await equipmentRegistryApi.create(parsed);
    return normalizeEquipmentRegistry(response.data);
  });

const updateEquipmentRegistry = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentRegistryId(id);
    const parsed = parseEquipmentRegistryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_REGISTRIES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentRegistry({ id: parsedId, ...parsed });
    }
    const response = await equipmentRegistryApi.update(parsedId, parsed);
    return normalizeEquipmentRegistry(response.data);
  });

const deleteEquipmentRegistry = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentRegistryId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_REGISTRIES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentRegistry({ id: parsedId });
    }
    const response = await equipmentRegistryApi.remove(parsedId);
    return normalizeEquipmentRegistry(response.data);
  });

export {
  listEquipmentRegistries,
  getEquipmentRegistry,
  createEquipmentRegistry,
  updateEquipmentRegistry,
  deleteEquipmentRegistry,
};
