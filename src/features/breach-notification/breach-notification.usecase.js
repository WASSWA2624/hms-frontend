/**
 * Breach Notification Use Cases
 * File: breach-notification.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { breachNotificationApi } from './breach-notification.api';
import { normalizeBreachNotification, normalizeBreachNotificationList } from './breach-notification.model';
import {
  parseBreachNotificationId,
  parseBreachNotificationListParams,
  parseBreachNotificationPayload,
} from './breach-notification.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listBreachNotifications = async (params = {}) =>
  execute(async () => {
    const parsed = parseBreachNotificationListParams(params);
    const response = await breachNotificationApi.list(parsed);
    return normalizeBreachNotificationList(response.data);
  });

const getBreachNotification = async (id) =>
  execute(async () => {
    const parsedId = parseBreachNotificationId(id);
    const response = await breachNotificationApi.get(parsedId);
    return normalizeBreachNotification(response.data);
  });

const createBreachNotification = async (payload) =>
  execute(async () => {
    const parsed = parseBreachNotificationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.BREACH_NOTIFICATIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeBreachNotification(parsed);
    }
    const response = await breachNotificationApi.create(parsed);
    return normalizeBreachNotification(response.data);
  });

const updateBreachNotification = async (id, payload) =>
  execute(async () => {
    const parsedId = parseBreachNotificationId(id);
    const parsed = parseBreachNotificationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.BREACH_NOTIFICATIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeBreachNotification({ id: parsedId, ...parsed });
    }
    const response = await breachNotificationApi.update(parsedId, parsed);
    return normalizeBreachNotification(response.data);
  });

const resolveBreachNotification = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseBreachNotificationId(id);
    const parsed = parseBreachNotificationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.BREACH_NOTIFICATIONS.RESOLVE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeBreachNotification({
        id: parsedId,
        status: parsed.status || 'RESOLVED',
        ...parsed,
      });
    }
    const response = await breachNotificationApi.resolve(parsedId, parsed);
    return normalizeBreachNotification(response.data);
  });

export {
  listBreachNotifications,
  getBreachNotification,
  createBreachNotification,
  updateBreachNotification,
  resolveBreachNotification,
};
