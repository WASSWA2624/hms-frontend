/**
 * User Role Rules Tests
 * File: user-role.rules.test.js
 */
import { parseUserRoleId, parseUserRoleListParams, parseUserRolePayload } from '@features/user-role';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('user-role.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseUserRoleId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseUserRolePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseUserRoleListParams);
  });
});
