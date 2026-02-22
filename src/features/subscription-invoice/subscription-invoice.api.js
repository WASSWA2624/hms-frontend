/**
 * Subscription Invoice API
 * File: subscription-invoice.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const subscriptionInvoiceApi = createCrudApi(endpoints.SUBSCRIPTION_INVOICES);
subscriptionInvoiceApi.collect = (id, payload = {}) =>
  apiClient({
    url: endpoints.SUBSCRIPTION_INVOICES.COLLECT(id),
    method: 'POST',
    body: payload,
  });
subscriptionInvoiceApi.retry = (id, payload = {}) =>
  apiClient({
    url: endpoints.SUBSCRIPTION_INVOICES.RETRY(id),
    method: 'POST',
    body: payload,
  });

export { subscriptionInvoiceApi };
