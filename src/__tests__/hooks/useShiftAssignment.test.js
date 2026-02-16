/**
 * useShiftAssignment Hook Tests
 * File: useShiftAssignment.test.js
 */
import useShiftAssignment from '@hooks/useShiftAssignment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useShiftAssignment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useShiftAssignment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
