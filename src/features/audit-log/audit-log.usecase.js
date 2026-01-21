/**
 * Audit Log Use Cases
 * File: audit-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { auditLogApi } from './audit-log.api';
import { normalizeAuditLog, normalizeAuditLogList } from './audit-log.model';
import { parseAuditLogId, parseAuditLogListParams, parseAuditLogPayload } from './audit-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAuditLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseAuditLogListParams(params);
    const response = await auditLogApi.list(parsed);
    return normalizeAuditLogList(response.data);
  });

const getAuditLog = async (id) =>
  execute(async () => {
    const parsedId = parseAuditLogId(id);
    const response = await auditLogApi.get(parsedId);
    return normalizeAuditLog(response.data);
  });

const createAuditLog = async (payload) =>
  execute(async () => {
    const parsed = parseAuditLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AUDIT_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAuditLog(parsed);
    }
    const response = await auditLogApi.create(parsed);
    return normalizeAuditLog(response.data);
  });

const updateAuditLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAuditLogId(id);
    const parsed = parseAuditLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AUDIT_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAuditLog({ id: parsedId, ...parsed });
    }
    const response = await auditLogApi.update(parsedId, parsed);
    return normalizeAuditLog(response.data);
  });

const deleteAuditLog = async (id) =>
  execute(async () => {
    const parsedId = parseAuditLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.AUDIT_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAuditLog({ id: parsedId });
    }
    const response = await auditLogApi.remove(parsedId);
    return normalizeAuditLog(response.data);
  });

export { listAuditLogs, getAuditLog, createAuditLog, updateAuditLog, deleteAuditLog };
