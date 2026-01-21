/**
 * useAvailabilitySlot Hook Tests
 * File: useAvailabilitySlot.test.js
 */
import useAvailabilitySlot from '@hooks/useAvailabilitySlot';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAvailabilitySlot', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAvailabilitySlot);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
