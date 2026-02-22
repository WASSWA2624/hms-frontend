/**
 * Subscription Plan API
 * File: subscription-plan.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const subscriptionPlanApi = createCrudApi(endpoints.SUBSCRIPTION_PLANS);
subscriptionPlanApi.getEntitlements = (id) =>
  apiClient({
    url: endpoints.SUBSCRIPTION_PLANS.ENTITLEMENTS(id),
    method: 'GET',
  });
subscriptionPlanApi.getAddOnEligibility = (id) =>
  apiClient({
    url: endpoints.SUBSCRIPTION_PLANS.ADD_ON_ELIGIBILITY(id),
    method: 'GET',
  });

export { subscriptionPlanApi };
