/**
 * Staff Profile Rules Tests
 * File: staff-profile.rules.test.js
 */
import {
  parseStaffProfileId,
  parseStaffProfileListParams,
  parseStaffProfilePayload,
} from '@features/staff-profile';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('staff-profile.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseStaffProfileId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseStaffProfilePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseStaffProfileListParams);
  });
});
