/**
 * Bed Rules Tests
 * File: bed.rules.test.js
 */
import { parseBedId, parseBedListParams, parseBedPayload } from '@features/bed';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('bed.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseBedId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseBedPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseBedListParams);
  });
});
