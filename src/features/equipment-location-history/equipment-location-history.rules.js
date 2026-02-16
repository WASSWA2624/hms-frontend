/**
 * Equipment Location History Rules
 * File: equipment-location-history.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentLocationHistoryId = (value) => parseId(value);
const parseEquipmentLocationHistoryPayload = (value) => parsePayload(value);
const parseEquipmentLocationHistoryListParams = (value) => parseListParams(value);

export {
  parseEquipmentLocationHistoryId,
  parseEquipmentLocationHistoryPayload,
  parseEquipmentLocationHistoryListParams,
};
