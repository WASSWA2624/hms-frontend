/**
 * useInsuranceClaim Hook Tests
 * File: useInsuranceClaim.test.js
 */
import useInsuranceClaim from '@hooks/useInsuranceClaim';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useInsuranceClaim', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useInsuranceClaim);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'submit', 'reconcile']);
  });
});
