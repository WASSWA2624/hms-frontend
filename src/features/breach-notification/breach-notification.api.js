/**
 * Breach Notification API
 * File: breach-notification.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const breachNotificationApi = createCrudApi(endpoints.BREACH_NOTIFICATIONS);

export { breachNotificationApi };
