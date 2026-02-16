/**
 * useKpiSnapshot Hook Tests
 * File: useKpiSnapshot.test.js
 */
import useKpiSnapshot from '@hooks/useKpiSnapshot';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useKpiSnapshot', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useKpiSnapshot);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
