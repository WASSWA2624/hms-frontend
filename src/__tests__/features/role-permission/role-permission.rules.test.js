/**
 * Role Permission Rules Tests
 * File: role-permission.rules.test.js
 */
import {
  parseRolePermissionId,
  parseRolePermissionListParams,
  parseRolePermissionPayload,
} from '@features/role-permission';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('role-permission.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseRolePermissionId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseRolePermissionPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseRolePermissionListParams);
  });
});
