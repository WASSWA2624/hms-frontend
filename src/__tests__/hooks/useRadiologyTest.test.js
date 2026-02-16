/**
 * useRadiologyTest Hook Tests
 * File: useRadiologyTest.test.js
 */
import useRadiologyTest from '@hooks/useRadiologyTest';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRadiologyTest', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRadiologyTest);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
