/**
 * useRadiologyResult Hook Tests
 * File: useRadiologyResult.test.js
 */
import useRadiologyResult from '@hooks/useRadiologyResult';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRadiologyResult', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRadiologyResult);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
