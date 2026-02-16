/**
 * Shift Use Cases
 * File: shift.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { shiftApi } from './shift.api';
import { normalizeShift, normalizeShiftList } from './shift.model';
import { parseShiftId, parseShiftListParams, parseShiftPayload } from './shift.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listShifts = async (params = {}) =>
  execute(async () => {
    const parsed = parseShiftListParams(params);
    const response = await shiftApi.list(parsed);
    return normalizeShiftList(response.data);
  });

const getShift = async (id) =>
  execute(async () => {
    const parsedId = parseShiftId(id);
    const response = await shiftApi.get(parsedId);
    return normalizeShift(response.data);
  });

const createShift = async (payload) =>
  execute(async () => {
    const parsed = parseShiftPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeShift(parsed);
    }
    const response = await shiftApi.create(parsed);
    return normalizeShift(response.data);
  });

const updateShift = async (id, payload) =>
  execute(async () => {
    const parsedId = parseShiftId(id);
    const parsed = parseShiftPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeShift({ id: parsedId, ...parsed });
    }
    const response = await shiftApi.update(parsedId, parsed);
    return normalizeShift(response.data);
  });

const deleteShift = async (id) =>
  execute(async () => {
    const parsedId = parseShiftId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeShift({ id: parsedId });
    }
    const response = await shiftApi.remove(parsedId);
    return normalizeShift(response.data);
  });

const publishShift = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseShiftId(id);
    const parsed = parseShiftPayload(payload);
    const response = await shiftApi.publish(parsedId, parsed);
    return normalizeShift(response.data);
  });

export { listShifts, getShift, createShift, updateShift, deleteShift, publishShift };
