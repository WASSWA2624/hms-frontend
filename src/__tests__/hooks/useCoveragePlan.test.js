/**
 * useCoveragePlan Hook Tests
 * File: useCoveragePlan.test.js
 */
import useCoveragePlan from '@hooks/useCoveragePlan';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useCoveragePlan', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useCoveragePlan);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
