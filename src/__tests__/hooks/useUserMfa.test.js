/**
 * useUserMfa Hook Tests
 * File: useUserMfa.test.js
 */
import useUserMfa from '@hooks/useUserMfa';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useUserMfa', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useUserMfa);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
      'verify',
      'enable',
      'disable',
    ]);
  });
});
