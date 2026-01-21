/**
 * Audit Log Rules
 * File: audit-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAuditLogId = (value) => parseId(value);
const parseAuditLogPayload = (value) => parsePayload(value);
const parseAuditLogListParams = (value) => parseListParams(value);

export { parseAuditLogId, parseAuditLogPayload, parseAuditLogListParams };
