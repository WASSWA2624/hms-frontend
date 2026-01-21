/**
 * PHI Access Log Rules
 * File: phi-access-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePhiAccessLogId = (value) => parseId(value);
const parsePhiAccessLogPayload = (value) => parsePayload(value);
const parsePhiAccessLogListParams = (value) => parseListParams(value);

export { parsePhiAccessLogId, parsePhiAccessLogPayload, parsePhiAccessLogListParams };
