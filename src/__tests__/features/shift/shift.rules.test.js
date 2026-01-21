/**
 * Shift Rules Tests
 * File: shift.rules.test.js
 */
import { parseShiftId, parseShiftListParams, parseShiftPayload } from '@features/shift';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('shift.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseShiftId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseShiftPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseShiftListParams);
  });
});
