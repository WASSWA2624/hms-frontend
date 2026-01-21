/**
 * User Role Model Tests
 * File: user-role.model.test.js
 */
import { normalizeUserRole, normalizeUserRoleList } from '@features/user-role';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('user-role.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeUserRole, normalizeUserRoleList);
  });
});
