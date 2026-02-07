/**
 * useStaffAvailability Hook Tests
 * File: useStaffAvailability.test.js
 */
import useStaffAvailability from '@hooks/useStaffAvailability';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useStaffAvailability', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useStaffAvailability);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

