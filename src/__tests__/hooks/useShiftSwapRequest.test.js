/**
 * useShiftSwapRequest Hook Tests
 * File: useShiftSwapRequest.test.js
 */
import useShiftSwapRequest from '@hooks/useShiftSwapRequest';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useShiftSwapRequest', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useShiftSwapRequest);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
