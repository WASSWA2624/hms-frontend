/**
 * Equipment Warranty Contract Use Cases
 * File: equipment-warranty-contract.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentWarrantyContractApi } from './equipment-warranty-contract.api';
import { normalizeEquipmentWarrantyContract, normalizeEquipmentWarrantyContractList } from './equipment-warranty-contract.model';
import {
  parseEquipmentWarrantyContractId,
  parseEquipmentWarrantyContractListParams,
  parseEquipmentWarrantyContractPayload,
} from './equipment-warranty-contract.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentWarrantyContracts = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentWarrantyContractListParams(params);
    const response = await equipmentWarrantyContractApi.list(parsed);
    return normalizeEquipmentWarrantyContractList(response.data);
  });

const getEquipmentWarrantyContract = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentWarrantyContractId(id);
    const response = await equipmentWarrantyContractApi.get(parsedId);
    return normalizeEquipmentWarrantyContract(response.data);
  });

const createEquipmentWarrantyContract = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentWarrantyContractPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WARRANTY_CONTRACTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentWarrantyContract(parsed);
    }
    const response = await equipmentWarrantyContractApi.create(parsed);
    return normalizeEquipmentWarrantyContract(response.data);
  });

const updateEquipmentWarrantyContract = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentWarrantyContractId(id);
    const parsed = parseEquipmentWarrantyContractPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WARRANTY_CONTRACTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentWarrantyContract({ id: parsedId, ...parsed });
    }
    const response = await equipmentWarrantyContractApi.update(parsedId, parsed);
    return normalizeEquipmentWarrantyContract(response.data);
  });

const deleteEquipmentWarrantyContract = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentWarrantyContractId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_WARRANTY_CONTRACTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentWarrantyContract({ id: parsedId });
    }
    const response = await equipmentWarrantyContractApi.remove(parsedId);
    return normalizeEquipmentWarrantyContract(response.data);
  });

export {
  listEquipmentWarrantyContracts,
  getEquipmentWarrantyContract,
  createEquipmentWarrantyContract,
  updateEquipmentWarrantyContract,
  deleteEquipmentWarrantyContract,
};
