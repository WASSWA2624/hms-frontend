/**
 * Equipment Spare Part Rules
 * File: equipment-spare-part.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentSparePartId = (value) => parseId(value);
const parseEquipmentSparePartPayload = (value) => parsePayload(value);
const parseEquipmentSparePartListParams = (value) => parseListParams(value);

export {
  parseEquipmentSparePartId,
  parseEquipmentSparePartPayload,
  parseEquipmentSparePartListParams,
};
