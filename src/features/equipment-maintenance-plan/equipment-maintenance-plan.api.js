/**
 * Equipment Maintenance Plan API
 * File: equipment-maintenance-plan.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentMaintenancePlanApi = createCrudApi(endpoints.EQUIPMENT_MAINTENANCE_PLANS);

export { equipmentMaintenancePlanApi };
