/**
 * useBedAssignment Hook Tests
 * File: useBedAssignment.test.js
 */
import useBedAssignment from '@hooks/useBedAssignment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useBedAssignment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useBedAssignment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
