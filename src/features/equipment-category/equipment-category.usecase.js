/**
 * Equipment Category Use Cases
 * File: equipment-category.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentCategoryApi } from './equipment-category.api';
import { normalizeEquipmentCategory, normalizeEquipmentCategoryList } from './equipment-category.model';
import {
  parseEquipmentCategoryId,
  parseEquipmentCategoryListParams,
  parseEquipmentCategoryPayload,
} from './equipment-category.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentCategories = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentCategoryListParams(params);
    const response = await equipmentCategoryApi.list(parsed);
    return normalizeEquipmentCategoryList(response.data);
  });

const getEquipmentCategory = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentCategoryId(id);
    const response = await equipmentCategoryApi.get(parsedId);
    return normalizeEquipmentCategory(response.data);
  });

const createEquipmentCategory = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentCategoryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_CATEGORIES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentCategory(parsed);
    }
    const response = await equipmentCategoryApi.create(parsed);
    return normalizeEquipmentCategory(response.data);
  });

const updateEquipmentCategory = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentCategoryId(id);
    const parsed = parseEquipmentCategoryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_CATEGORIES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentCategory({ id: parsedId, ...parsed });
    }
    const response = await equipmentCategoryApi.update(parsedId, parsed);
    return normalizeEquipmentCategory(response.data);
  });

const deleteEquipmentCategory = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentCategoryId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_CATEGORIES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentCategory({ id: parsedId });
    }
    const response = await equipmentCategoryApi.remove(parsedId);
    return normalizeEquipmentCategory(response.data);
  });

export {
  listEquipmentCategories,
  getEquipmentCategory,
  createEquipmentCategory,
  updateEquipmentCategory,
  deleteEquipmentCategory,
};
