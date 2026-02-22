/**
 * usePayment Hook Tests
 * File: usePayment.test.js
 */
import usePayment from '@hooks/usePayment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePayment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePayment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'reconcile', 'channelBreakdown']);
  });
});
