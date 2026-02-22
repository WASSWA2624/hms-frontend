/**
 * Notification API
 * File: notification.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const notificationApi = createCrudApi(endpoints.NOTIFICATIONS);

export { notificationApi };
