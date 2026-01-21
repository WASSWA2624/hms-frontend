/**
 * useUser Hook Tests
 * File: useUser.test.js
 */
import useUser from '@hooks/useUser';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useUser', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useUser);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
