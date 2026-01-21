/**
 * API Key Permission Rules Tests
 * File: api-key-permission.rules.test.js
 */
import {
  parseApiKeyPermissionId,
  parseApiKeyPermissionListParams,
  parseApiKeyPermissionPayload,
} from '@features/api-key-permission';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('api-key-permission.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseApiKeyPermissionId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseApiKeyPermissionPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseApiKeyPermissionListParams);
  });
});
