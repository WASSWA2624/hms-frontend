/**
 * Tenant Use Cases
 * File: tenant.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { tenantApi } from './tenant.api';
import { normalizeTenant, normalizeTenantList } from './tenant.model';
import { parseTenantId, parseTenantListParams, parseTenantPayload } from './tenant.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listTenants = async (params = {}) =>
  execute(async () => {
    const parsed = parseTenantListParams(params);
    const response = await tenantApi.list(parsed);
    return normalizeTenantList(response.data);
  });

const getTenant = async (id) =>
  execute(async () => {
    const parsedId = parseTenantId(id);
    const response = await tenantApi.get(parsedId);
    return normalizeTenant(response.data);
  });

const createTenant = async (payload) =>
  execute(async () => {
    const parsed = parseTenantPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.TENANTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeTenant(parsed);
    }
    const response = await tenantApi.create(parsed);
    return normalizeTenant(response.data);
  });

const updateTenant = async (id, payload) =>
  execute(async () => {
    const parsedId = parseTenantId(id);
    const parsed = parseTenantPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.TENANTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeTenant({ id: parsedId, ...parsed });
    }
    const response = await tenantApi.update(parsedId, parsed);
    return normalizeTenant(response.data);
  });

const deleteTenant = async (id) =>
  execute(async () => {
    const parsedId = parseTenantId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.TENANTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeTenant({ id: parsedId });
    }
    const response = await tenantApi.remove(parsedId);
    return normalizeTenant(response.data);
  });

export { listTenants, getTenant, createTenant, updateTenant, deleteTenant };
