/**
 * useRadiologyOrder Hook Tests
 * File: useRadiologyOrder.test.js
 */
import useRadiologyOrder from '@hooks/useRadiologyOrder';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRadiologyOrder', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRadiologyOrder);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
