/**
 * Ward Rules Tests
 * File: ward.rules.test.js
 */
import { parseWardId, parseWardListParams, parseWardPayload } from '@features/ward';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('ward.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseWardId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseWardPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseWardListParams);
  });
});
