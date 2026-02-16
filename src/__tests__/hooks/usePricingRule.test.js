/**
 * usePricingRule Hook Tests
 * File: usePricingRule.test.js
 */
import usePricingRule from '@hooks/usePricingRule';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePricingRule', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePricingRule);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
