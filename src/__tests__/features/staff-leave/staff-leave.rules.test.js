/**
 * Staff Leave Rules Tests
 * File: staff-leave.rules.test.js
 */
import { parseStaffLeaveId, parseStaffLeaveListParams, parseStaffLeavePayload } from '@features/staff-leave';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('staff-leave.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseStaffLeaveId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseStaffLeavePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseStaffLeaveListParams);
  });
});
