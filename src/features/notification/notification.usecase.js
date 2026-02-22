/**
 * Notification Use Cases
 * File: notification.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { notificationApi } from './notification.api';
import { normalizeNotification, normalizeNotificationList } from './notification.model';
import {
  parseNotificationId,
  parseNotificationListParams,
  parseNotificationPayload,
} from './notification.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listNotifications = async (params = {}) =>
  execute(async () => {
    const parsed = parseNotificationListParams(params);
    const response = await notificationApi.list(parsed);
    return normalizeNotificationList(response.data);
  });

const getNotification = async (id) =>
  execute(async () => {
    const parsedId = parseNotificationId(id);
    const response = await notificationApi.get(parsedId);
    return normalizeNotification(response.data);
  });

const createNotification = async (payload) =>
  execute(async () => {
    const parsed = parseNotificationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.NOTIFICATIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeNotification(parsed);
    }
    const response = await notificationApi.create(parsed);
    return normalizeNotification(response.data);
  });

const updateNotification = async (id, payload) =>
  execute(async () => {
    const parsedId = parseNotificationId(id);
    const parsed = parseNotificationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.NOTIFICATIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeNotification({ id: parsedId, ...parsed });
    }
    const response = await notificationApi.update(parsedId, parsed);
    return normalizeNotification(response.data);
  });

const deleteNotification = async (id) =>
  execute(async () => {
    const parsedId = parseNotificationId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.NOTIFICATIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeNotification({ id: parsedId });
    }
    const response = await notificationApi.remove(parsedId);
    return normalizeNotification(response.data);
  });

const buildReadStatePayload = (isRead) => {
  const timestamp = isRead ? new Date().toISOString() : null;
  return {
    is_read: isRead,
    read: isRead,
    read_at: timestamp,
    readAt: timestamp,
  };
};

const markNotificationRead = async (id) =>
  updateNotification(id, buildReadStatePayload(true));

const markNotificationUnread = async (id) =>
  updateNotification(id, buildReadStatePayload(false));

export {
  listNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationRead,
  markNotificationUnread,
};
