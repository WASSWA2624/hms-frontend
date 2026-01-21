/**
 * Audit Log Model
 * File: audit-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAuditLog = (value) => normalize(value);
const normalizeAuditLogList = (value) => normalizeList(value);

export { normalizeAuditLog, normalizeAuditLogList };
