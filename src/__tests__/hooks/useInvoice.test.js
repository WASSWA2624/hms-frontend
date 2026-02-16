/**
 * useInvoice Hook Tests
 * File: useInvoice.test.js
 */
import useInvoice from '@hooks/useInvoice';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useInvoice', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useInvoice);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
