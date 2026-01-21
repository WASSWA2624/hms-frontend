/**
 * Appointment Participant Model Tests
 * File: appointment-participant.model.test.js
 */
import { normalizeAppointmentParticipant, normalizeAppointmentParticipantList } from '@features/appointment-participant';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('appointment-participant.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAppointmentParticipant, normalizeAppointmentParticipantList);
  });
});
