/**
 * Appointment Reminder Model Tests
 * File: appointment-reminder.model.test.js
 */
import { normalizeAppointmentReminder, normalizeAppointmentReminderList } from '@features/appointment-reminder';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('appointment-reminder.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAppointmentReminder, normalizeAppointmentReminderList);
  });
});
