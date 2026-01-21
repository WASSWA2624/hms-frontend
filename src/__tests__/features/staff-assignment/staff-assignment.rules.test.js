/**
 * Staff Assignment Rules Tests
 * File: staff-assignment.rules.test.js
 */
import {
  parseStaffAssignmentId,
  parseStaffAssignmentListParams,
  parseStaffAssignmentPayload,
} from '@features/staff-assignment';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('staff-assignment.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseStaffAssignmentId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseStaffAssignmentPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseStaffAssignmentListParams);
  });
});
