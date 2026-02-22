/**
 * Subscription API
 * File: subscription.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString, createCrudApi } from '@services/api';

const subscriptionApi = createCrudApi(endpoints.SUBSCRIPTIONS);
subscriptionApi.upgrade = (id, payload = {}) =>
  apiClient({
    url: endpoints.SUBSCRIPTIONS.UPGRADE(id),
    method: 'POST',
    body: payload,
  });
subscriptionApi.downgrade = (id, payload = {}) =>
  apiClient({
    url: endpoints.SUBSCRIPTIONS.DOWNGRADE(id),
    method: 'POST',
    body: payload,
  });
subscriptionApi.renew = (id, payload = {}) =>
  apiClient({
    url: endpoints.SUBSCRIPTIONS.RENEW(id),
    method: 'POST',
    body: payload,
  });
subscriptionApi.getProrationPreview = (id, params = {}) =>
  apiClient({
    url: `${endpoints.SUBSCRIPTIONS.PRORATION_PREVIEW(id)}${buildQueryString(params)}`,
    method: 'GET',
  });
subscriptionApi.getUsageSummary = (id) =>
  apiClient({
    url: endpoints.SUBSCRIPTIONS.USAGE_SUMMARY(id),
    method: 'GET',
  });
subscriptionApi.getFitCheck = (id) =>
  apiClient({
    url: endpoints.SUBSCRIPTIONS.FIT_CHECK(id),
    method: 'GET',
  });
subscriptionApi.getUpgradeRecommendation = (id) =>
  apiClient({
    url: endpoints.SUBSCRIPTIONS.UPGRADE_RECOMMENDATION(id),
    method: 'GET',
  });

export { subscriptionApi };
