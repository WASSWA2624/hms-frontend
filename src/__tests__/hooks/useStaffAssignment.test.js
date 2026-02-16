/**
 * useStaffAssignment Hook Tests
 * File: useStaffAssignment.test.js
 */
import useStaffAssignment from '@hooks/useStaffAssignment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useStaffAssignment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useStaffAssignment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
