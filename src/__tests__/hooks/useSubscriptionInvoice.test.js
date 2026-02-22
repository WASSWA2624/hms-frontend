/**
 * useSubscriptionInvoice Hook Tests
 * File: useSubscriptionInvoice.test.js
 */
import useSubscriptionInvoice from '@hooks/useSubscriptionInvoice';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useSubscriptionInvoice', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useSubscriptionInvoice);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
      'collect',
      'retry',
    ]);
  });
});
