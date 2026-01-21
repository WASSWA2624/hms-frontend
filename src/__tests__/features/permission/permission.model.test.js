/**
 * Permission Model Tests
 * File: permission.model.test.js
 */
import { normalizePermission, normalizePermissionList } from '@features/permission';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('permission.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePermission, normalizePermissionList);
  });
});
