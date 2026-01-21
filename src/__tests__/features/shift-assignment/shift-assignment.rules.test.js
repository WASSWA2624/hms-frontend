/**
 * Shift Assignment Rules Tests
 * File: shift-assignment.rules.test.js
 */
import {
  parseShiftAssignmentId,
  parseShiftAssignmentListParams,
  parseShiftAssignmentPayload,
} from '@features/shift-assignment';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('shift-assignment.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseShiftAssignmentId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseShiftAssignmentPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseShiftAssignmentListParams);
  });
});
