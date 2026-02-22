/**
 * Pharmacy Order API
 * File: pharmacy-order.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const pharmacyOrderApi = createCrudApi(endpoints.PHARMACY_ORDERS);
pharmacyOrderApi.dispense = (id, payload = {}) =>
  apiClient({
    url: endpoints.PHARMACY_ORDERS.DISPENSE(id),
    method: 'POST',
    body: payload,
  });

export { pharmacyOrderApi };
