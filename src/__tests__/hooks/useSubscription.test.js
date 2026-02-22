/**
 * useSubscription Hook Tests
 * File: useSubscription.test.js
 */
import useSubscription from '@hooks/useSubscription';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useSubscription', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useSubscription);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
      'upgrade',
      'downgrade',
      'renew',
      'getProrationPreview',
      'getUsageSummary',
      'getFitCheck',
      'getUpgradeRecommendation',
    ]);
  });
});
