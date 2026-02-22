/**
 * Breach Notification API
 * File: breach-notification.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const breachNotificationApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.BREACH_NOTIFICATIONS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id) =>
    apiClient({
      url: endpoints.BREACH_NOTIFICATIONS.GET(id),
      method: 'GET',
    }),
  create: (payload) =>
    apiClient({
      url: endpoints.BREACH_NOTIFICATIONS.CREATE,
      method: 'POST',
      body: payload,
    }),
  update: (id, payload) =>
    apiClient({
      url: endpoints.BREACH_NOTIFICATIONS.UPDATE(id),
      method: 'PUT',
      body: payload,
    }),
  resolve: (id, payload = {}) =>
    apiClient({
      url: endpoints.BREACH_NOTIFICATIONS.RESOLVE(id),
      method: 'POST',
      body: payload,
    }),
};

export { breachNotificationApi };
