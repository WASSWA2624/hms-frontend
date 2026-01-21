/**
 * usePermission Hook Tests
 * File: usePermission.test.js
 */
import usePermission from '@hooks/usePermission';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePermission', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePermission);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
