/**
 * useLabOrder Hook Tests
 * File: useLabOrder.test.js
 */
import useLabOrder from '@hooks/useLabOrder';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useLabOrder', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useLabOrder);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
