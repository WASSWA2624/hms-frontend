/**
 * Staff Assignment Use Cases
 * File: staff-assignment.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { staffAssignmentApi } from './staff-assignment.api';
import { normalizeStaffAssignment, normalizeStaffAssignmentList } from './staff-assignment.model';
import {
  parseStaffAssignmentId,
  parseStaffAssignmentListParams,
  parseStaffAssignmentPayload,
} from './staff-assignment.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listStaffAssignments = async (params = {}) =>
  execute(async () => {
    const parsed = parseStaffAssignmentListParams(params);
    const response = await staffAssignmentApi.list(parsed);
    return normalizeStaffAssignmentList(response.data);
  });

const getStaffAssignment = async (id) =>
  execute(async () => {
    const parsedId = parseStaffAssignmentId(id);
    const response = await staffAssignmentApi.get(parsedId);
    return normalizeStaffAssignment(response.data);
  });

const createStaffAssignment = async (payload) =>
  execute(async () => {
    const parsed = parseStaffAssignmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_ASSIGNMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffAssignment(parsed);
    }
    const response = await staffAssignmentApi.create(parsed);
    return normalizeStaffAssignment(response.data);
  });

const updateStaffAssignment = async (id, payload) =>
  execute(async () => {
    const parsedId = parseStaffAssignmentId(id);
    const parsed = parseStaffAssignmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_ASSIGNMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffAssignment({ id: parsedId, ...parsed });
    }
    const response = await staffAssignmentApi.update(parsedId, parsed);
    return normalizeStaffAssignment(response.data);
  });

const deleteStaffAssignment = async (id) =>
  execute(async () => {
    const parsedId = parseStaffAssignmentId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_ASSIGNMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeStaffAssignment({ id: parsedId });
    }
    const response = await staffAssignmentApi.remove(parsedId);
    return normalizeStaffAssignment(response.data);
  });

export {
  listStaffAssignments,
  getStaffAssignment,
  createStaffAssignment,
  updateStaffAssignment,
  deleteStaffAssignment,
};
