/**
 * Equipment Maintenance Plan Model
 * File: equipment-maintenance-plan.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentMaintenancePlan = (value) => normalize(value);
const normalizeEquipmentMaintenancePlanList = (value) => normalizeList(value);

export { normalizeEquipmentMaintenancePlan, normalizeEquipmentMaintenancePlanList };
