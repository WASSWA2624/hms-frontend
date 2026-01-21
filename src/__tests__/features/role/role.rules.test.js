/**
 * Role Rules Tests
 * File: role.rules.test.js
 */
import { parseRoleId, parseRoleListParams, parseRolePayload } from '@features/role';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('role.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseRoleId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseRolePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseRoleListParams);
  });
});
