/**
 * useSubscriptionPlan Hook Tests
 * File: useSubscriptionPlan.test.js
 */
import useSubscriptionPlan from '@hooks/useSubscriptionPlan';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useSubscriptionPlan', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useSubscriptionPlan);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
      'getEntitlements',
      'getAddOnEligibility',
    ]);
  });
});
