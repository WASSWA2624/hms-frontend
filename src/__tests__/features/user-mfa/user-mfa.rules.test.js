/**
 * User MFA Rules Tests
 * File: user-mfa.rules.test.js
 */
import { parseUserMfaId, parseUserMfaListParams, parseUserMfaPayload } from '@features/user-mfa';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('user-mfa.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseUserMfaId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseUserMfaPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseUserMfaListParams);
  });
});
