/**
 * useRolePermission Hook Tests
 * File: useRolePermission.test.js
 */
import useRolePermission from '@hooks/useRolePermission';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRolePermission', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRolePermission);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
