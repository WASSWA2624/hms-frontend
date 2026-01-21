/**
 * OAuth Account Rules Tests
 * File: oauth-account.rules.test.js
 */
import {
  parseOauthAccountId,
  parseOauthAccountListParams,
  parseOauthAccountPayload,
} from '@features/oauth-account';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('oauth-account.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseOauthAccountId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseOauthAccountPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseOauthAccountListParams);
  });
});
