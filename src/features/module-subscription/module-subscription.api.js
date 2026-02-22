/**
 * Module Subscription API
 * File: module-subscription.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const moduleSubscriptionApi = createCrudApi(endpoints.MODULE_SUBSCRIPTIONS);
moduleSubscriptionApi.activate = (id, payload = {}) =>
  apiClient({
    url: endpoints.MODULE_SUBSCRIPTIONS.ACTIVATE(id),
    method: 'POST',
    body: payload,
  });
moduleSubscriptionApi.deactivate = (id, payload = {}) =>
  apiClient({
    url: endpoints.MODULE_SUBSCRIPTIONS.DEACTIVATE(id),
    method: 'POST',
    body: payload,
  });
moduleSubscriptionApi.checkEligibility = (id) =>
  apiClient({
    url: endpoints.MODULE_SUBSCRIPTIONS.ELIGIBILITY_CHECK(id),
    method: 'GET',
  });

export { moduleSubscriptionApi };
