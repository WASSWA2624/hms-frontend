/**
 * useInvoiceItem Hook Tests
 * File: useInvoiceItem.test.js
 */
import useInvoiceItem from '@hooks/useInvoiceItem';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useInvoiceItem', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useInvoiceItem);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
