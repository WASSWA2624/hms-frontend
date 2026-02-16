/**
 * Equipment Service Provider Use Cases
 * File: equipment-service-provider.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentServiceProviderApi } from './equipment-service-provider.api';
import { normalizeEquipmentServiceProvider, normalizeEquipmentServiceProviderList } from './equipment-service-provider.model';
import {
  parseEquipmentServiceProviderId,
  parseEquipmentServiceProviderListParams,
  parseEquipmentServiceProviderPayload,
} from './equipment-service-provider.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentServiceProviders = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentServiceProviderListParams(params);
    const response = await equipmentServiceProviderApi.list(parsed);
    return normalizeEquipmentServiceProviderList(response.data);
  });

const getEquipmentServiceProvider = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentServiceProviderId(id);
    const response = await equipmentServiceProviderApi.get(parsedId);
    return normalizeEquipmentServiceProvider(response.data);
  });

const createEquipmentServiceProvider = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentServiceProviderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SERVICE_PROVIDERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentServiceProvider(parsed);
    }
    const response = await equipmentServiceProviderApi.create(parsed);
    return normalizeEquipmentServiceProvider(response.data);
  });

const updateEquipmentServiceProvider = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentServiceProviderId(id);
    const parsed = parseEquipmentServiceProviderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SERVICE_PROVIDERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentServiceProvider({ id: parsedId, ...parsed });
    }
    const response = await equipmentServiceProviderApi.update(parsedId, parsed);
    return normalizeEquipmentServiceProvider(response.data);
  });

const deleteEquipmentServiceProvider = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentServiceProviderId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SERVICE_PROVIDERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentServiceProvider({ id: parsedId });
    }
    const response = await equipmentServiceProviderApi.remove(parsedId);
    return normalizeEquipmentServiceProvider(response.data);
  });

export {
  listEquipmentServiceProviders,
  getEquipmentServiceProvider,
  createEquipmentServiceProvider,
  updateEquipmentServiceProvider,
  deleteEquipmentServiceProvider,
};
