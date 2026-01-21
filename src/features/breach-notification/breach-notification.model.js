/**
 * Breach Notification Model
 * File: breach-notification.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeBreachNotification = (value) => normalize(value);
const normalizeBreachNotificationList = (value) => normalizeList(value);

export { normalizeBreachNotification, normalizeBreachNotificationList };
