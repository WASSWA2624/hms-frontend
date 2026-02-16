/**
 * useHousekeepingTask Hook Tests
 * File: useHousekeepingTask.test.js
 */
import useHousekeepingTask from '@hooks/useHousekeepingTask';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useHousekeepingTask', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useHousekeepingTask);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
