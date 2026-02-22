/**
 * Maintenance Request Use Cases
 * File: maintenance-request.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { maintenanceRequestApi } from './maintenance-request.api';
import {
  normalizeMaintenanceRequest,
  normalizeMaintenanceRequestList,
} from './maintenance-request.model';
import {
  parseMaintenanceRequestId,
  parseMaintenanceRequestListParams,
  parseMaintenanceRequestPayload,
} from './maintenance-request.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listMaintenanceRequests = async (params = {}) =>
  execute(async () => {
    const parsed = parseMaintenanceRequestListParams(params);
    const response = await maintenanceRequestApi.list(parsed);
    return normalizeMaintenanceRequestList(response.data);
  });

const getMaintenanceRequest = async (id) =>
  execute(async () => {
    const parsedId = parseMaintenanceRequestId(id);
    const response = await maintenanceRequestApi.get(parsedId);
    return normalizeMaintenanceRequest(response.data);
  });

const createMaintenanceRequest = async (payload) =>
  execute(async () => {
    const parsed = parseMaintenanceRequestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MAINTENANCE_REQUESTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeMaintenanceRequest(parsed);
    }
    const response = await maintenanceRequestApi.create(parsed);
    return normalizeMaintenanceRequest(response.data);
  });

const updateMaintenanceRequest = async (id, payload) =>
  execute(async () => {
    const parsedId = parseMaintenanceRequestId(id);
    const parsed = parseMaintenanceRequestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MAINTENANCE_REQUESTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeMaintenanceRequest({ id: parsedId, ...parsed });
    }
    const response = await maintenanceRequestApi.update(parsedId, parsed);
    return normalizeMaintenanceRequest(response.data);
  });

const deleteMaintenanceRequest = async (id) =>
  execute(async () => {
    const parsedId = parseMaintenanceRequestId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.MAINTENANCE_REQUESTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeMaintenanceRequest({ id: parsedId });
    }
    const response = await maintenanceRequestApi.remove(parsedId);
    return normalizeMaintenanceRequest(response.data);
  });

const triageMaintenanceRequest = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseMaintenanceRequestId(id);
    const parsed = parseMaintenanceRequestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MAINTENANCE_REQUESTS.TRIAGE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeMaintenanceRequest({
        id: parsedId,
        status: parsed.status || 'IN_PROGRESS',
        ...parsed,
      });
    }
    const response = await maintenanceRequestApi.triage(parsedId, parsed);
    return normalizeMaintenanceRequest(response.data);
  });

export {
  listMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  triageMaintenanceRequest,
};
