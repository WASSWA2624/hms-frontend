/**
 * useUserRole Hook Tests
 * File: useUserRole.test.js
 */
import useUserRole from '@hooks/useUserRole';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useUserRole', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useUserRole);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
