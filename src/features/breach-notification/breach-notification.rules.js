/**
 * Breach Notification Rules
 * File: breach-notification.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseBreachNotificationId = (value) => parseId(value);
const parseBreachNotificationPayload = (value) => parsePayload(value);
const parseBreachNotificationListParams = (value) => parseListParams(value);

export {
  parseBreachNotificationId,
  parseBreachNotificationPayload,
  parseBreachNotificationListParams,
};
