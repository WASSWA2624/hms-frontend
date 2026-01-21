/**
 * useProviderSchedule Hook Tests
 * File: useProviderSchedule.test.js
 */
import useProviderSchedule from '@hooks/useProviderSchedule';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useProviderSchedule', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useProviderSchedule);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
