/**
 * Equipment Recall Notice Use Cases
 * File: equipment-recall-notice.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentRecallNoticeApi } from './equipment-recall-notice.api';
import { normalizeEquipmentRecallNotice, normalizeEquipmentRecallNoticeList } from './equipment-recall-notice.model';
import {
  parseEquipmentRecallNoticeId,
  parseEquipmentRecallNoticeListParams,
  parseEquipmentRecallNoticePayload,
} from './equipment-recall-notice.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentRecallNotices = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentRecallNoticeListParams(params);
    const response = await equipmentRecallNoticeApi.list(parsed);
    return normalizeEquipmentRecallNoticeList(response.data);
  });

const getEquipmentRecallNotice = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentRecallNoticeId(id);
    const response = await equipmentRecallNoticeApi.get(parsedId);
    return normalizeEquipmentRecallNotice(response.data);
  });

const createEquipmentRecallNotice = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentRecallNoticePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_RECALL_NOTICES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentRecallNotice(parsed);
    }
    const response = await equipmentRecallNoticeApi.create(parsed);
    return normalizeEquipmentRecallNotice(response.data);
  });

const updateEquipmentRecallNotice = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentRecallNoticeId(id);
    const parsed = parseEquipmentRecallNoticePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_RECALL_NOTICES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentRecallNotice({ id: parsedId, ...parsed });
    }
    const response = await equipmentRecallNoticeApi.update(parsedId, parsed);
    return normalizeEquipmentRecallNotice(response.data);
  });

const deleteEquipmentRecallNotice = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentRecallNoticeId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_RECALL_NOTICES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentRecallNotice({ id: parsedId });
    }
    const response = await equipmentRecallNoticeApi.remove(parsedId);
    return normalizeEquipmentRecallNotice(response.data);
  });

export {
  listEquipmentRecallNotices,
  getEquipmentRecallNotice,
  createEquipmentRecallNotice,
  updateEquipmentRecallNotice,
  deleteEquipmentRecallNotice,
};
