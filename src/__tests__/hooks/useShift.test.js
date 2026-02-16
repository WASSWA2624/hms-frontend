/**
 * useShift Hook Tests
 * File: useShift.test.js
 */
import useShift from '@hooks/useShift';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useShift', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useShift);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'publish']);
  });
});
