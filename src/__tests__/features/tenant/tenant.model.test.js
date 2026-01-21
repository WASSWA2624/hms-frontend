/**
 * Tenant Model Tests
 * File: tenant.model.test.js
 */
import { normalizeTenant, normalizeTenantList } from '@features/tenant';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('tenant.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeTenant, normalizeTenantList);
  });
});
