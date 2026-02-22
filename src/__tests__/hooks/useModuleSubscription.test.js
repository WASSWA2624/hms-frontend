/**
 * useModuleSubscription Hook Tests
 * File: useModuleSubscription.test.js
 */
import useModuleSubscription from '@hooks/useModuleSubscription';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useModuleSubscription', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useModuleSubscription);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
      'activate',
      'deactivate',
      'checkEligibility',
    ]);
  });
});
