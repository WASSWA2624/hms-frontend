/**
 * Tenant Rules Tests
 * File: tenant.rules.test.js
 */
import { parseTenantId, parseTenantListParams, parseTenantPayload } from '@features/tenant';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('tenant.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseTenantId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseTenantPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseTenantListParams);
  });
});
