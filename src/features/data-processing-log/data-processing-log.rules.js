/**
 * Data Processing Log Rules
 * File: data-processing-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseDataProcessingLogId = (value) => parseId(value);
const parseDataProcessingLogPayload = (value) => parsePayload(value);
const parseDataProcessingLogListParams = (value) => parseListParams(value);

export {
  parseDataProcessingLogId,
  parseDataProcessingLogPayload,
  parseDataProcessingLogListParams,
};
