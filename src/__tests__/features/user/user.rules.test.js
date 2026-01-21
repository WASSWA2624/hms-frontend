/**
 * User Rules Tests
 * File: user.rules.test.js
 */
import { parseUserId, parseUserListParams, parseUserPayload } from '@features/user';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('user.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseUserId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseUserPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseUserListParams);
  });
});
