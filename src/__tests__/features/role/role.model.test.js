/**
 * Role Model Tests
 * File: role.model.test.js
 */
import { normalizeRole, normalizeRoleList } from '@features/role';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('role.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeRole, normalizeRoleList);
  });
});
