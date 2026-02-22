/**
 * Payment Use Cases
 * File: payment.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { paymentApi } from './payment.api';
import { normalizePayment, normalizePaymentList } from './payment.model';
import { parsePaymentId, parsePaymentListParams, parsePaymentPayload } from './payment.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPayments = async (params = {}) =>
  execute(async () => {
    const parsed = parsePaymentListParams(params);
    const response = await paymentApi.list(parsed);
    return normalizePaymentList(response.data);
  });

const getPayment = async (id) =>
  execute(async () => {
    const parsedId = parsePaymentId(id);
    const response = await paymentApi.get(parsedId);
    return normalizePayment(response.data);
  });

const createPayment = async (payload) =>
  execute(async () => {
    const parsed = parsePaymentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePayment(parsed);
    }
    const response = await paymentApi.create(parsed);
    return normalizePayment(response.data);
  });

const updatePayment = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePaymentId(id);
    const parsed = parsePaymentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePayment({ id: parsedId, ...parsed });
    }
    const response = await paymentApi.update(parsedId, parsed);
    return normalizePayment(response.data);
  });

const deletePayment = async (id) =>
  execute(async () => {
    const parsedId = parsePaymentId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePayment({ id: parsedId });
    }
    const response = await paymentApi.remove(parsedId);
    return normalizePayment(response.data);
  });

const reconcilePayment = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parsePaymentId(id);
    const parsed = parsePaymentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYMENTS.RECONCILE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePayment({ id: parsedId, ...parsed });
    }
    const response = await paymentApi.reconcile(parsedId, parsed);
    return normalizePayment(response.data);
  });

const getPaymentChannelBreakdown = async (id) =>
  execute(async () => {
    const parsedId = parsePaymentId(id);
    const response = await paymentApi.getChannelBreakdown(parsedId);
    return response?.data ?? {};
  });

export {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  reconcilePayment,
  getPaymentChannelBreakdown,
};
