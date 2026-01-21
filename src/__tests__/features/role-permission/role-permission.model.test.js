/**
 * Role Permission Model Tests
 * File: role-permission.model.test.js
 */
import { normalizeRolePermission, normalizeRolePermissionList } from '@features/role-permission';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('role-permission.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeRolePermission, normalizeRolePermissionList);
  });
});
