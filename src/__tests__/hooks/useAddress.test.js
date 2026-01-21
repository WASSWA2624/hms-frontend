/**
 * useAddress Hook Tests
 * File: useAddress.test.js
 */
import useAddress from '@hooks/useAddress';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAddress', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAddress);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
