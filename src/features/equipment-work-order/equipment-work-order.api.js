/**
 * Equipment Work Order API
 * File: equipment-work-order.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const equipmentWorkOrderApi = createCrudApi(endpoints.EQUIPMENT_WORK_ORDERS);
equipmentWorkOrderApi.start = (id, payload = {}) =>
  apiClient({
    url: endpoints.EQUIPMENT_WORK_ORDERS.START(id),
    method: 'POST',
    body: payload,
  });
equipmentWorkOrderApi.returnToService = (id, payload = {}) =>
  apiClient({
    url: endpoints.EQUIPMENT_WORK_ORDERS.RETURN_TO_SERVICE(id),
    method: 'POST',
    body: payload,
  });

export { equipmentWorkOrderApi };
