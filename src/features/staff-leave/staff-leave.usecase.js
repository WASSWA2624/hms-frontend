/**
 * Staff Leave Use Cases
 * File: staff-leave.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { staffLeaveApi } from './staff-leave.api';
import { normalizeStaffLeave, normalizeStaffLeaveList } from './staff-leave.model';
import { parseStaffLeaveId, parseStaffLeaveListParams, parseStaffLeavePayload } from './staff-leave.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listStaffLeaves = async (params = {}) =>
  execute(async () => {
    const parsed = parseStaffLeaveListParams(params);
    const response = await staffLeaveApi.list(parsed);
    return normalizeStaffLeaveList(response.data);
  });

const getStaffLeave = async (id) =>
  execute(async () => {
    const parsedId = parseStaffLeaveId(id);
    const response = await staffLeaveApi.get(parsedId);
    return normalizeStaffLeave(response.data);
  });

const createStaffLeave = async (payload) =>
  execute(async () => {
    const parsed = parseStaffLeavePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_LEAVES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffLeave(parsed);
    }
    const response = await staffLeaveApi.create(parsed);
    return normalizeStaffLeave(response.data);
  });

const updateStaffLeave = async (id, payload) =>
  execute(async () => {
    const parsedId = parseStaffLeaveId(id);
    const parsed = parseStaffLeavePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_LEAVES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffLeave({ id: parsedId, ...parsed });
    }
    const response = await staffLeaveApi.update(parsedId, parsed);
    return normalizeStaffLeave(response.data);
  });

const deleteStaffLeave = async (id) =>
  execute(async () => {
    const parsedId = parseStaffLeaveId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_LEAVES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeStaffLeave({ id: parsedId });
    }
    const response = await staffLeaveApi.remove(parsedId);
    return normalizeStaffLeave(response.data);
  });

export { listStaffLeaves, getStaffLeave, createStaffLeave, updateStaffLeave, deleteStaffLeave };
