/**
 * Equipment Downtime Log Rules
 * File: equipment-downtime-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentDowntimeLogId = (value) => parseId(value);
const parseEquipmentDowntimeLogPayload = (value) => parsePayload(value);
const parseEquipmentDowntimeLogListParams = (value) => parseListParams(value);

export {
  parseEquipmentDowntimeLogId,
  parseEquipmentDowntimeLogPayload,
  parseEquipmentDowntimeLogListParams,
};
