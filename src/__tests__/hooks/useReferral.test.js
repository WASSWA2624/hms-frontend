/**
 * useReferral Hook Tests
 * File: useReferral.test.js
 */
import useReferral from '@hooks/useReferral';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useReferral', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useReferral);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'redeem']);
  });
});
