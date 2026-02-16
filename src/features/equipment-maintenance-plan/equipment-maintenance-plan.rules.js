/**
 * Equipment Maintenance Plan Rules
 * File: equipment-maintenance-plan.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentMaintenancePlanId = (value) => parseId(value);
const parseEquipmentMaintenancePlanPayload = (value) => parsePayload(value);
const parseEquipmentMaintenancePlanListParams = (value) => parseListParams(value);

export {
  parseEquipmentMaintenancePlanId,
  parseEquipmentMaintenancePlanPayload,
  parseEquipmentMaintenancePlanListParams,
};
