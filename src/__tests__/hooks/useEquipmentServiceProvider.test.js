/**
 * useEquipmentServiceProvider Hook Tests
 * File: useEquipmentServiceProvider.test.js
 */
import useEquipmentServiceProvider from '@hooks/useEquipmentServiceProvider';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentServiceProvider', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentServiceProvider);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
