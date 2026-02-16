/**
 * Equipment Spare Part Use Cases
 * File: equipment-spare-part.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentSparePartApi } from './equipment-spare-part.api';
import { normalizeEquipmentSparePart, normalizeEquipmentSparePartList } from './equipment-spare-part.model';
import {
  parseEquipmentSparePartId,
  parseEquipmentSparePartListParams,
  parseEquipmentSparePartPayload,
} from './equipment-spare-part.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentSpareParts = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentSparePartListParams(params);
    const response = await equipmentSparePartApi.list(parsed);
    return normalizeEquipmentSparePartList(response.data);
  });

const getEquipmentSparePart = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentSparePartId(id);
    const response = await equipmentSparePartApi.get(parsedId);
    return normalizeEquipmentSparePart(response.data);
  });

const createEquipmentSparePart = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentSparePartPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SPARE_PARTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentSparePart(parsed);
    }
    const response = await equipmentSparePartApi.create(parsed);
    return normalizeEquipmentSparePart(response.data);
  });

const updateEquipmentSparePart = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentSparePartId(id);
    const parsed = parseEquipmentSparePartPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SPARE_PARTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentSparePart({ id: parsedId, ...parsed });
    }
    const response = await equipmentSparePartApi.update(parsedId, parsed);
    return normalizeEquipmentSparePart(response.data);
  });

const deleteEquipmentSparePart = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentSparePartId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SPARE_PARTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentSparePart({ id: parsedId });
    }
    const response = await equipmentSparePartApi.remove(parsedId);
    return normalizeEquipmentSparePart(response.data);
  });

export {
  listEquipmentSpareParts,
  getEquipmentSparePart,
  createEquipmentSparePart,
  updateEquipmentSparePart,
  deleteEquipmentSparePart,
};
