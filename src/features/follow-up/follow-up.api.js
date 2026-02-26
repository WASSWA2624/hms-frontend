/**
 * Follow Up API
 * File: follow-up.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString, createCrudApi } from '@services/api';

const followUpApi = createCrudApi(endpoints.FOLLOW_UPS);
followUpApi.complete = (id, payload = {}) =>
  apiClient({
    url: endpoints.FOLLOW_UPS.COMPLETE(id),
    method: 'POST',
    body: payload,
  });
followUpApi.cancel = (id, payload = {}) =>
  apiClient({
    url: endpoints.FOLLOW_UPS.CANCEL(id),
    method: 'POST',
    body: payload,
  });
followUpApi.dispatchReminders = (payload = {}) =>
  apiClient({
    url: endpoints.FOLLOW_UPS.REMINDER_DISPATCH,
    method: 'POST',
    body: payload,
  });
followUpApi.getReminderDueSummary = (params = {}) =>
  apiClient({
    url: `${endpoints.FOLLOW_UPS.REMINDER_DUE_SUMMARY}${buildQueryString(params)}`,
    method: 'GET',
  });

export { followUpApi };
