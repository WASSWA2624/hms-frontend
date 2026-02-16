/**
 * useBillingAdjustment Hook Tests
 * File: useBillingAdjustment.test.js
 */
import useBillingAdjustment from '@hooks/useBillingAdjustment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useBillingAdjustment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useBillingAdjustment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
