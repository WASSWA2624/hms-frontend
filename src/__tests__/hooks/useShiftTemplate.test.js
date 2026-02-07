/**
 * useShiftTemplate Hook Tests
 * File: useShiftTemplate.test.js
 */
import useShiftTemplate from '@hooks/useShiftTemplate';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useShiftTemplate', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useShiftTemplate);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

