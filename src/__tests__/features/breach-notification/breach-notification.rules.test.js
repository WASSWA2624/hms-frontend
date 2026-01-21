/**
 * Breach Notification Rules Tests
 * File: breach-notification.rules.test.js
 */
import {
  parseBreachNotificationId,
  parseBreachNotificationListParams,
  parseBreachNotificationPayload,
} from '@features/breach-notification';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('breach-notification.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseBreachNotificationId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseBreachNotificationPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseBreachNotificationListParams);
  });
});
