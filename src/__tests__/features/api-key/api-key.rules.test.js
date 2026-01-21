/**
 * API Key Rules Tests
 * File: api-key.rules.test.js
 */
import { parseApiKeyId, parseApiKeyListParams, parseApiKeyPayload } from '@features/api-key';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('api-key.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseApiKeyId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseApiKeyPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseApiKeyListParams);
  });
});
