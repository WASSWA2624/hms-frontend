/**
 * Equipment Safety Test Log Rules
 * File: equipment-safety-test-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentSafetyTestLogId = (value) => parseId(value);
const parseEquipmentSafetyTestLogPayload = (value) => parsePayload(value);
const parseEquipmentSafetyTestLogListParams = (value) => parseListParams(value);

export {
  parseEquipmentSafetyTestLogId,
  parseEquipmentSafetyTestLogPayload,
  parseEquipmentSafetyTestLogListParams,
};
