/**
 * useUserProfile Hook Tests
 * File: useUserProfile.test.js
 */
import useUserProfile from '@hooks/useUserProfile';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useUserProfile', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useUserProfile);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
