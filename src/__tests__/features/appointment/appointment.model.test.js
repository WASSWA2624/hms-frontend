/**
 * Appointment Model Tests
 * File: appointment.model.test.js
 */
import { normalizeAppointment, normalizeAppointmentList } from '@features/appointment';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('appointment.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAppointment, normalizeAppointmentList);
  });
});
