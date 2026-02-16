/**
 * Equipment Work Order API
 * File: equipment-work-order.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentWorkOrderApi = createCrudApi(endpoints.EQUIPMENT_WORK_ORDERS);

export { equipmentWorkOrderApi };
