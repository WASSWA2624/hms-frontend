/**
 * Shift Swap Request Rules Tests
 * File: shift-swap-request.rules.test.js
 */
import {
  parseShiftSwapRequestId,
  parseShiftSwapRequestListParams,
  parseShiftSwapRequestPayload,
} from '@features/shift-swap-request';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('shift-swap-request.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseShiftSwapRequestId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseShiftSwapRequestPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseShiftSwapRequestListParams);
  });
});
