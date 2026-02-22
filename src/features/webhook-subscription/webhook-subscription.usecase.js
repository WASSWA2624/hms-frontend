/**
 * Webhook Subscription Use Cases
 * File: webhook-subscription.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { webhookSubscriptionApi } from './webhook-subscription.api';
import { normalizeWebhookSubscription, normalizeWebhookSubscriptionList } from './webhook-subscription.model';
import {
  parseWebhookSubscriptionId,
  parseWebhookSubscriptionListParams,
  parseWebhookSubscriptionPayload,
} from './webhook-subscription.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listWebhookSubscriptions = async (params = {}) =>
  execute(async () => {
    const parsed = parseWebhookSubscriptionListParams(params);
    const response = await webhookSubscriptionApi.list(parsed);
    return normalizeWebhookSubscriptionList(response.data);
  });

const getWebhookSubscription = async (id) =>
  execute(async () => {
    const parsedId = parseWebhookSubscriptionId(id);
    const response = await webhookSubscriptionApi.get(parsedId);
    return normalizeWebhookSubscription(response.data);
  });

const createWebhookSubscription = async (payload) =>
  execute(async () => {
    const parsed = parseWebhookSubscriptionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeWebhookSubscription(parsed);
    }
    const response = await webhookSubscriptionApi.create(parsed);
    return normalizeWebhookSubscription(response.data);
  });

const updateWebhookSubscription = async (id, payload) =>
  execute(async () => {
    const parsedId = parseWebhookSubscriptionId(id);
    const parsed = parseWebhookSubscriptionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeWebhookSubscription({ id: parsedId, ...parsed });
    }
    const response = await webhookSubscriptionApi.update(parsedId, parsed);
    return normalizeWebhookSubscription(response.data);
  });

const deleteWebhookSubscription = async (id) =>
  execute(async () => {
    const parsedId = parseWebhookSubscriptionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeWebhookSubscription({ id: parsedId });
    }
    const response = await webhookSubscriptionApi.remove(parsedId);
    return normalizeWebhookSubscription(response.data);
  });

const replayWebhookSubscription = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseWebhookSubscriptionId(id);
    const parsed = parseWebhookSubscriptionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.REPLAY(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeWebhookSubscription({ id: parsedId, ...parsed });
    }
    const response = await webhookSubscriptionApi.replay(parsedId, parsed);
    return normalizeWebhookSubscription(response.data);
  });

export {
  listWebhookSubscriptions,
  getWebhookSubscription,
  createWebhookSubscription,
  updateWebhookSubscription,
  deleteWebhookSubscription,
  replayWebhookSubscription,
};
