/**
 * Subscription Plan Use Cases
 * File: subscription-plan.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { subscriptionPlanApi } from './subscription-plan.api';
import { normalizeSubscriptionPlan, normalizeSubscriptionPlanList } from './subscription-plan.model';
import {
  parseSubscriptionPlanId,
  parseSubscriptionPlanListParams,
  parseSubscriptionPlanPayload,
} from './subscription-plan.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listSubscriptionPlans = async (params = {}) =>
  execute(async () => {
    const parsed = parseSubscriptionPlanListParams(params);
    const response = await subscriptionPlanApi.list(parsed);
    return normalizeSubscriptionPlanList(response.data);
  });

const getSubscriptionPlan = async (id) =>
  execute(async () => {
    const parsedId = parseSubscriptionPlanId(id);
    const response = await subscriptionPlanApi.get(parsedId);
    return normalizeSubscriptionPlan(response.data);
  });

const createSubscriptionPlan = async (payload) =>
  execute(async () => {
    const parsed = parseSubscriptionPlanPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_PLANS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSubscriptionPlan(parsed);
    }
    const response = await subscriptionPlanApi.create(parsed);
    return normalizeSubscriptionPlan(response.data);
  });

const updateSubscriptionPlan = async (id, payload) =>
  execute(async () => {
    const parsedId = parseSubscriptionPlanId(id);
    const parsed = parseSubscriptionPlanPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_PLANS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeSubscriptionPlan({ id: parsedId, ...parsed });
    }
    const response = await subscriptionPlanApi.update(parsedId, parsed);
    return normalizeSubscriptionPlan(response.data);
  });

const deleteSubscriptionPlan = async (id) =>
  execute(async () => {
    const parsedId = parseSubscriptionPlanId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_PLANS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeSubscriptionPlan({ id: parsedId });
    }
    const response = await subscriptionPlanApi.remove(parsedId);
    return normalizeSubscriptionPlan(response.data);
  });

const getSubscriptionPlanEntitlements = async (id) =>
  execute(async () => {
    const parsedId = parseSubscriptionPlanId(id);
    const response = await subscriptionPlanApi.getEntitlements(parsedId);
    return normalizeSubscriptionPlan(response.data);
  });

const getSubscriptionPlanAddOnEligibility = async (id) =>
  execute(async () => {
    const parsedId = parseSubscriptionPlanId(id);
    const response = await subscriptionPlanApi.getAddOnEligibility(parsedId);
    return normalizeSubscriptionPlan(response.data);
  });

export {
  listSubscriptionPlans,
  getSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlanEntitlements,
  getSubscriptionPlanAddOnEligibility,
};
