/**
 * Webhook Subscription API
 * File: webhook-subscription.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const webhookSubscriptionApi = createCrudApi(endpoints.WEBHOOK_SUBSCRIPTIONS);
webhookSubscriptionApi.replay = (id, payload = {}) =>
  apiClient({
    url: endpoints.WEBHOOK_SUBSCRIPTIONS.REPLAY(id),
    method: 'POST',
    body: payload,
  });

export { webhookSubscriptionApi };
