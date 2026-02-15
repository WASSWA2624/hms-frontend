/**
 * useIcuStay Hook Tests
 * File: useIcuStay.test.js
 */
import useIcuStay from '@hooks/useIcuStay';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useIcuStay', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useIcuStay);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
