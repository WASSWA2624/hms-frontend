/**
 * useLabResult Hook Tests
 * File: useLabResult.test.js
 */
import useLabResult from '@hooks/useLabResult';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useLabResult', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useLabResult);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
