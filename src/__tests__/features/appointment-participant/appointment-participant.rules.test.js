/**
 * Appointment Participant Rules Tests
 * File: appointment-participant.rules.test.js
 */
import {
  parseAppointmentParticipantId,
  parseAppointmentParticipantListParams,
  parseAppointmentParticipantPayload,
} from '@features/appointment-participant';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('appointment-participant.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAppointmentParticipantId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAppointmentParticipantPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAppointmentParticipantListParams);
  });
});
