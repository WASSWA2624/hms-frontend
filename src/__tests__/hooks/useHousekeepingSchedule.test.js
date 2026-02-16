/**
 * useHousekeepingSchedule Hook Tests
 * File: useHousekeepingSchedule.test.js
 */
import useHousekeepingSchedule from '@hooks/useHousekeepingSchedule';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useHousekeepingSchedule', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useHousekeepingSchedule);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
