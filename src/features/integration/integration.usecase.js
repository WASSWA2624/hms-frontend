/**
 * Integration Use Cases
 * File: integration.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { integrationApi } from './integration.api';
import { normalizeIntegration, normalizeIntegrationList } from './integration.model';
import { parseIntegrationId, parseIntegrationListParams, parseIntegrationPayload } from './integration.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listIntegrations = async (params = {}) =>
  execute(async () => {
    const parsed = parseIntegrationListParams(params);
    const response = await integrationApi.list(parsed);
    return normalizeIntegrationList(response.data);
  });

const getIntegration = async (id) =>
  execute(async () => {
    const parsedId = parseIntegrationId(id);
    const response = await integrationApi.get(parsedId);
    return normalizeIntegration(response.data);
  });

const createIntegration = async (payload) =>
  execute(async () => {
    const parsed = parseIntegrationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INTEGRATIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeIntegration(parsed);
    }
    const response = await integrationApi.create(parsed);
    return normalizeIntegration(response.data);
  });

const updateIntegration = async (id, payload) =>
  execute(async () => {
    const parsedId = parseIntegrationId(id);
    const parsed = parseIntegrationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INTEGRATIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeIntegration({ id: parsedId, ...parsed });
    }
    const response = await integrationApi.update(parsedId, parsed);
    return normalizeIntegration(response.data);
  });

const deleteIntegration = async (id) =>
  execute(async () => {
    const parsedId = parseIntegrationId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.INTEGRATIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeIntegration({ id: parsedId });
    }
    const response = await integrationApi.remove(parsedId);
    return normalizeIntegration(response.data);
  });

const testIntegrationConnection = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIntegrationId(id);
    const parsed = parseIntegrationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INTEGRATIONS.TEST_CONNECTION(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeIntegration({ id: parsedId, ...parsed });
    }
    const response = await integrationApi.testConnection(parsedId, parsed);
    return normalizeIntegration(response.data);
  });

const syncIntegrationNow = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIntegrationId(id);
    const parsed = parseIntegrationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INTEGRATIONS.SYNC_NOW(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeIntegration({ id: parsedId, ...parsed });
    }
    const response = await integrationApi.syncNow(parsedId, parsed);
    return normalizeIntegration(response.data);
  });

export {
  listIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegrationConnection,
  syncIntegrationNow,
};
