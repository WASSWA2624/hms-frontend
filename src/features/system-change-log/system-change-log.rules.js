/**
 * System Change Log Rules
 * File: system-change-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseSystemChangeLogId = (value) => parseId(value);
const parseSystemChangeLogPayload = (value) => parsePayload(value);
const parseSystemChangeLogListParams = (value) => parseListParams(value);

export {
  parseSystemChangeLogId,
  parseSystemChangeLogPayload,
  parseSystemChangeLogListParams,
};
