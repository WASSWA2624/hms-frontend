/**
 * useRole Hook Tests
 * File: useRole.test.js
 */
import useRole from '@hooks/useRole';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRole', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRole);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
