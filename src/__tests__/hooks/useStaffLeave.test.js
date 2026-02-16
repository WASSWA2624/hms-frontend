/**
 * useStaffLeave Hook Tests
 * File: useStaffLeave.test.js
 */
import useStaffLeave from '@hooks/useStaffLeave';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useStaffLeave', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useStaffLeave);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
