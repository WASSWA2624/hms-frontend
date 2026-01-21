/**
 * Unit Rules Tests
 * File: unit.rules.test.js
 */
import { parseUnitId, parseUnitListParams, parseUnitPayload } from '@features/unit';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('unit.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseUnitId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseUnitPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseUnitListParams);
  });
});
