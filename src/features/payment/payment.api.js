/**
 * Payment API
 * File: payment.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const paymentApi = createCrudApi(endpoints.PAYMENTS);
paymentApi.reconcile = (id, payload = {}) =>
  apiClient({
    url: endpoints.PAYMENTS.RECONCILE(id),
    method: 'POST',
    body: payload,
  });
paymentApi.getChannelBreakdown = (id) =>
  apiClient({
    url: endpoints.PAYMENTS.CHANNEL_BREAKDOWN(id),
    method: 'GET',
  });

export { paymentApi };
