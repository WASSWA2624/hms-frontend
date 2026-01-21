/**
 * Appointment Rules Tests
 * File: appointment.rules.test.js
 */
import { parseAppointmentId, parseAppointmentListParams, parseAppointmentPayload } from '@features/appointment';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('appointment.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAppointmentId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAppointmentPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAppointmentListParams);
  });
});
