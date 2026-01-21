/**
 * Permission Rules Tests
 * File: permission.rules.test.js
 */
import { parsePermissionId, parsePermissionListParams, parsePermissionPayload } from '@features/permission';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('permission.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePermissionId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePermissionPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePermissionListParams);
  });
});
