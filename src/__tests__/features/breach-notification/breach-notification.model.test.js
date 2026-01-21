/**
 * Breach Notification Model Tests
 * File: breach-notification.model.test.js
 */
import { normalizeBreachNotification, normalizeBreachNotificationList } from '@features/breach-notification';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('breach-notification.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeBreachNotification, normalizeBreachNotificationList);
  });
});
