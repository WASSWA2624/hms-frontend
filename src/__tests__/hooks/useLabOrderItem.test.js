/**
 * useLabOrderItem Hook Tests
 * File: useLabOrderItem.test.js
 */
import useLabOrderItem from '@hooks/useLabOrderItem';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useLabOrderItem', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useLabOrderItem);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
