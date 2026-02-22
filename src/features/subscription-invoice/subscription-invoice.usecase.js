/**
 * Subscription Invoice Use Cases
 * File: subscription-invoice.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { subscriptionInvoiceApi } from './subscription-invoice.api';
import { normalizeSubscriptionInvoice, normalizeSubscriptionInvoiceList } from './subscription-invoice.model';
import {
  parseSubscriptionInvoiceId,
  parseSubscriptionInvoiceListParams,
  parseSubscriptionInvoicePayload,
} from './subscription-invoice.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listSubscriptionInvoices = async (params = {}) =>
  execute(async () => {
    const parsed = parseSubscriptionInvoiceListParams(params);
    const response = await subscriptionInvoiceApi.list(parsed);
    return normalizeSubscriptionInvoiceList(response.data);
  });

const getSubscriptionInvoice = async (id) =>
  execute(async () => {
    const parsedId = parseSubscriptionInvoiceId(id);
    const response = await subscriptionInvoiceApi.get(parsedId);
    return normalizeSubscriptionInvoice(response.data);
  });

const createSubscriptionInvoice = async (payload) =>
  execute(async () => {
    const parsed = parseSubscriptionInvoicePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_INVOICES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSubscriptionInvoice(parsed);
    }
    const response = await subscriptionInvoiceApi.create(parsed);
    return normalizeSubscriptionInvoice(response.data);
  });

const updateSubscriptionInvoice = async (id, payload) =>
  execute(async () => {
    const parsedId = parseSubscriptionInvoiceId(id);
    const parsed = parseSubscriptionInvoicePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_INVOICES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeSubscriptionInvoice({ id: parsedId, ...parsed });
    }
    const response = await subscriptionInvoiceApi.update(parsedId, parsed);
    return normalizeSubscriptionInvoice(response.data);
  });

const deleteSubscriptionInvoice = async (id) =>
  execute(async () => {
    const parsedId = parseSubscriptionInvoiceId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_INVOICES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeSubscriptionInvoice({ id: parsedId });
    }
    const response = await subscriptionInvoiceApi.remove(parsedId);
    return normalizeSubscriptionInvoice(response.data);
  });

const collectSubscriptionInvoice = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseSubscriptionInvoiceId(id);
    const parsed = parseSubscriptionInvoicePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_INVOICES.COLLECT(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSubscriptionInvoice({ id: parsedId, ...parsed });
    }
    const response = await subscriptionInvoiceApi.collect(parsedId, parsed);
    return normalizeSubscriptionInvoice(response.data);
  });

const retrySubscriptionInvoice = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseSubscriptionInvoiceId(id);
    const parsed = parseSubscriptionInvoicePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUBSCRIPTION_INVOICES.RETRY(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSubscriptionInvoice({ id: parsedId, ...parsed });
    }
    const response = await subscriptionInvoiceApi.retry(parsedId, parsed);
    return normalizeSubscriptionInvoice(response.data);
  });

export {
  listSubscriptionInvoices,
  getSubscriptionInvoice,
  createSubscriptionInvoice,
  updateSubscriptionInvoice,
  deleteSubscriptionInvoice,
  collectSubscriptionInvoice,
  retrySubscriptionInvoice,
};
