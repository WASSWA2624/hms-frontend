/**
 * Shift Swap Request Use Cases
 * File: shift-swap-request.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { shiftSwapRequestApi } from './shift-swap-request.api';
import { normalizeShiftSwapRequest, normalizeShiftSwapRequestList } from './shift-swap-request.model';
import {
  parseShiftSwapRequestId,
  parseShiftSwapRequestListParams,
  parseShiftSwapRequestPayload,
} from './shift-swap-request.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listShiftSwapRequests = async (params = {}) =>
  execute(async () => {
    const parsed = parseShiftSwapRequestListParams(params);
    const response = await shiftSwapRequestApi.list(parsed);
    return normalizeShiftSwapRequestList(response.data);
  });

const getShiftSwapRequest = async (id) =>
  execute(async () => {
    const parsedId = parseShiftSwapRequestId(id);
    const response = await shiftSwapRequestApi.get(parsedId);
    return normalizeShiftSwapRequest(response.data);
  });

const createShiftSwapRequest = async (payload) =>
  execute(async () => {
    const parsed = parseShiftSwapRequestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFT_SWAP_REQUESTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeShiftSwapRequest(parsed);
    }
    const response = await shiftSwapRequestApi.create(parsed);
    return normalizeShiftSwapRequest(response.data);
  });

const updateShiftSwapRequest = async (id, payload) =>
  execute(async () => {
    const parsedId = parseShiftSwapRequestId(id);
    const parsed = parseShiftSwapRequestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFT_SWAP_REQUESTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeShiftSwapRequest({ id: parsedId, ...parsed });
    }
    const response = await shiftSwapRequestApi.update(parsedId, parsed);
    return normalizeShiftSwapRequest(response.data);
  });

const deleteShiftSwapRequest = async (id) =>
  execute(async () => {
    const parsedId = parseShiftSwapRequestId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFT_SWAP_REQUESTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeShiftSwapRequest({ id: parsedId });
    }
    const response = await shiftSwapRequestApi.remove(parsedId);
    return normalizeShiftSwapRequest(response.data);
  });

export {
  listShiftSwapRequests,
  getShiftSwapRequest,
  createShiftSwapRequest,
  updateShiftSwapRequest,
  deleteShiftSwapRequest,
};
