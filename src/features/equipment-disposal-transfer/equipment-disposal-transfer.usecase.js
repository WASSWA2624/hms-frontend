/**
 * Equipment Disposal Transfer Use Cases
 * File: equipment-disposal-transfer.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentDisposalTransferApi } from './equipment-disposal-transfer.api';
import { normalizeEquipmentDisposalTransfer, normalizeEquipmentDisposalTransferList } from './equipment-disposal-transfer.model';
import {
  parseEquipmentDisposalTransferId,
  parseEquipmentDisposalTransferListParams,
  parseEquipmentDisposalTransferPayload,
} from './equipment-disposal-transfer.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentDisposalTransfers = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentDisposalTransferListParams(params);
    const response = await equipmentDisposalTransferApi.list(parsed);
    return normalizeEquipmentDisposalTransferList(response.data);
  });

const getEquipmentDisposalTransfer = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentDisposalTransferId(id);
    const response = await equipmentDisposalTransferApi.get(parsedId);
    return normalizeEquipmentDisposalTransfer(response.data);
  });

const createEquipmentDisposalTransfer = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentDisposalTransferPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_DISPOSAL_TRANSFERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentDisposalTransfer(parsed);
    }
    const response = await equipmentDisposalTransferApi.create(parsed);
    return normalizeEquipmentDisposalTransfer(response.data);
  });

const updateEquipmentDisposalTransfer = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentDisposalTransferId(id);
    const parsed = parseEquipmentDisposalTransferPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_DISPOSAL_TRANSFERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentDisposalTransfer({ id: parsedId, ...parsed });
    }
    const response = await equipmentDisposalTransferApi.update(parsedId, parsed);
    return normalizeEquipmentDisposalTransfer(response.data);
  });

const deleteEquipmentDisposalTransfer = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentDisposalTransferId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_DISPOSAL_TRANSFERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentDisposalTransfer({ id: parsedId });
    }
    const response = await equipmentDisposalTransferApi.remove(parsedId);
    return normalizeEquipmentDisposalTransfer(response.data);
  });

export {
  listEquipmentDisposalTransfers,
  getEquipmentDisposalTransfer,
  createEquipmentDisposalTransfer,
  updateEquipmentDisposalTransfer,
  deleteEquipmentDisposalTransfer,
};
