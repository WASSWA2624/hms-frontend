/**
 * User Profile Rules Tests
 * File: user-profile.rules.test.js
 */
import { parseUserProfileId, parseUserProfileListParams, parseUserProfilePayload } from '@features/user-profile';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('user-profile.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseUserProfileId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseUserProfilePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseUserProfileListParams);
  });
});
