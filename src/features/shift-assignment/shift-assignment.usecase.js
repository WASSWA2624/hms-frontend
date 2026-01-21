/**
 * Shift Assignment Use Cases
 * File: shift-assignment.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { shiftAssignmentApi } from './shift-assignment.api';
import { normalizeShiftAssignment, normalizeShiftAssignmentList } from './shift-assignment.model';
import {
  parseShiftAssignmentId,
  parseShiftAssignmentListParams,
  parseShiftAssignmentPayload,
} from './shift-assignment.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listShiftAssignments = async (params = {}) =>
  execute(async () => {
    const parsed = parseShiftAssignmentListParams(params);
    const response = await shiftAssignmentApi.list(parsed);
    return normalizeShiftAssignmentList(response.data);
  });

const getShiftAssignment = async (id) =>
  execute(async () => {
    const parsedId = parseShiftAssignmentId(id);
    const response = await shiftAssignmentApi.get(parsedId);
    return normalizeShiftAssignment(response.data);
  });

const createShiftAssignment = async (payload) =>
  execute(async () => {
    const parsed = parseShiftAssignmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFT_ASSIGNMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeShiftAssignment(parsed);
    }
    const response = await shiftAssignmentApi.create(parsed);
    return normalizeShiftAssignment(response.data);
  });

const updateShiftAssignment = async (id, payload) =>
  execute(async () => {
    const parsedId = parseShiftAssignmentId(id);
    const parsed = parseShiftAssignmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFT_ASSIGNMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeShiftAssignment({ id: parsedId, ...parsed });
    }
    const response = await shiftAssignmentApi.update(parsedId, parsed);
    return normalizeShiftAssignment(response.data);
  });

const deleteShiftAssignment = async (id) =>
  execute(async () => {
    const parsedId = parseShiftAssignmentId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.SHIFT_ASSIGNMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeShiftAssignment({ id: parsedId });
    }
    const response = await shiftAssignmentApi.remove(parsedId);
    return normalizeShiftAssignment(response.data);
  });

export {
  listShiftAssignments,
  getShiftAssignment,
  createShiftAssignment,
  updateShiftAssignment,
  deleteShiftAssignment,
};
