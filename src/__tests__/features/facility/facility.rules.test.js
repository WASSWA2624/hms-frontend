/**
 * Facility Rules Tests
 * File: facility.rules.test.js
 */
import { parseFacilityId, parseFacilityListParams, parseFacilityPayload } from '@features/facility';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('facility.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseFacilityId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseFacilityPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseFacilityListParams);
  });
});
