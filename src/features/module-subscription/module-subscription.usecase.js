/**
 * Module Subscription Use Cases
 * File: module-subscription.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { moduleSubscriptionApi } from './module-subscription.api';
import { normalizeModuleSubscription, normalizeModuleSubscriptionList } from './module-subscription.model';
import {
  parseModuleSubscriptionId,
  parseModuleSubscriptionListParams,
  parseModuleSubscriptionPayload,
} from './module-subscription.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listModuleSubscriptions = async (params = {}) =>
  execute(async () => {
    const parsed = parseModuleSubscriptionListParams(params);
    const response = await moduleSubscriptionApi.list(parsed);
    return normalizeModuleSubscriptionList(response.data);
  });

const getModuleSubscription = async (id) =>
  execute(async () => {
    const parsedId = parseModuleSubscriptionId(id);
    const response = await moduleSubscriptionApi.get(parsedId);
    return normalizeModuleSubscription(response.data);
  });

const createModuleSubscription = async (payload) =>
  execute(async () => {
    const parsed = parseModuleSubscriptionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MODULE_SUBSCRIPTIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeModuleSubscription(parsed);
    }
    const response = await moduleSubscriptionApi.create(parsed);
    return normalizeModuleSubscription(response.data);
  });

const updateModuleSubscription = async (id, payload) =>
  execute(async () => {
    const parsedId = parseModuleSubscriptionId(id);
    const parsed = parseModuleSubscriptionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MODULE_SUBSCRIPTIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeModuleSubscription({ id: parsedId, ...parsed });
    }
    const response = await moduleSubscriptionApi.update(parsedId, parsed);
    return normalizeModuleSubscription(response.data);
  });

const deleteModuleSubscription = async (id) =>
  execute(async () => {
    const parsedId = parseModuleSubscriptionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.MODULE_SUBSCRIPTIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeModuleSubscription({ id: parsedId });
    }
    const response = await moduleSubscriptionApi.remove(parsedId);
    return normalizeModuleSubscription(response.data);
  });

const activateModuleSubscription = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseModuleSubscriptionId(id);
    const parsed = parseModuleSubscriptionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MODULE_SUBSCRIPTIONS.ACTIVATE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeModuleSubscription({ id: parsedId, is_active: true, ...parsed });
    }
    const response = await moduleSubscriptionApi.activate(parsedId, parsed);
    return normalizeModuleSubscription(response.data);
  });

const deactivateModuleSubscription = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseModuleSubscriptionId(id);
    const parsed = parseModuleSubscriptionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MODULE_SUBSCRIPTIONS.DEACTIVATE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeModuleSubscription({ id: parsedId, is_active: false, ...parsed });
    }
    const response = await moduleSubscriptionApi.deactivate(parsedId, parsed);
    return normalizeModuleSubscription(response.data);
  });

const checkModuleSubscriptionEligibility = async (id) =>
  execute(async () => {
    const parsedId = parseModuleSubscriptionId(id);
    const response = await moduleSubscriptionApi.checkEligibility(parsedId);
    return normalizeModuleSubscription(response.data);
  });

export {
  listModuleSubscriptions,
  getModuleSubscription,
  createModuleSubscription,
  updateModuleSubscription,
  deleteModuleSubscription,
  activateModuleSubscription,
  deactivateModuleSubscription,
  checkModuleSubscriptionEligibility,
};
