/**
 * Equipment Work Order Rules
 * File: equipment-work-order.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentWorkOrderId = (value) => parseId(value);
const parseEquipmentWorkOrderPayload = (value) => parsePayload(value);
const parseEquipmentWorkOrderListParams = (value) => parseListParams(value);

export {
  parseEquipmentWorkOrderId,
  parseEquipmentWorkOrderPayload,
  parseEquipmentWorkOrderListParams,
};
