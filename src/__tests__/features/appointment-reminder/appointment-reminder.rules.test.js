/**
 * Appointment Reminder Rules Tests
 * File: appointment-reminder.rules.test.js
 */
import {
  parseAppointmentReminderId,
  parseAppointmentReminderListParams,
  parseAppointmentReminderPayload,
} from '@features/appointment-reminder';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('appointment-reminder.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAppointmentReminderId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAppointmentReminderPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAppointmentReminderListParams);
  });
});
