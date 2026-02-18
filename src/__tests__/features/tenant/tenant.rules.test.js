/**
 * Tenant Rules Tests
 * File: tenant.rules.test.js
 */
import {
  parseTenantCreatePayload,
  parseTenantId,
  parseTenantListParams,
  parseTenantPayload,
  parseTenantUpdatePayload,
} from '@features/tenant';
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

  it('parses create payload with backend-aligned validation', () => {
    expect(parseTenantCreatePayload({ name: '  Acme  ', slug: '  acme  ', is_active: true })).toEqual({
      name: 'Acme',
      slug: 'acme',
      is_active: true,
    });
    expect(parseTenantCreatePayload({ name: 'Acme', slug: '   ' })).toEqual({ name: 'Acme' });
    expect(() => parseTenantCreatePayload({})).toThrow();
  });

  it('parses update payload with nullable slug support', () => {
    expect(parseTenantUpdatePayload({ name: '  Acme  ', slug: '  ' })).toEqual({
      name: 'Acme',
      slug: null,
    });
    expect(parseTenantUpdatePayload({ is_active: false })).toEqual({ is_active: false });
  });

  it('normalizes boolean filters for backend query schema', () => {
    expect(parseTenantListParams({ is_active: true })).toEqual({ is_active: 'true' });
    expect(parseTenantListParams({ is_active: false })).toEqual({ is_active: 'false' });
  });
});
