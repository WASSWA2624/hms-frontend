/**
 * useStaffProfile Hook Tests
 * File: useStaffProfile.test.js
 */
import useStaffProfile from '@hooks/useStaffProfile';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useStaffProfile', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useStaffProfile);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
