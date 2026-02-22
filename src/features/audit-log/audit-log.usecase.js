/**
 * Audit Log Use Cases
 * File: audit-log.usecase.js
 */
import { handleError } from '@errors';
import { auditLogApi } from './audit-log.api';
import { normalizeAuditLog, normalizeAuditLogList } from './audit-log.model';
import { parseAuditLogId, parseAuditLogListParams } from './audit-log.rules';

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

export { listAuditLogs, getAuditLog };
