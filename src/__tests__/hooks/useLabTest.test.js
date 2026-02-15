/**
 * useLabTest Hook Tests
 * File: useLabTest.test.js
 */
import useLabTest from '@hooks/useLabTest';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useLabTest', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useLabTest);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
