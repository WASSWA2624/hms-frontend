/**
 * useEquipmentSparePart Hook Tests
 * File: useEquipmentSparePart.test.js
 */
import useEquipmentSparePart from '@hooks/useEquipmentSparePart';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentSparePart', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentSparePart);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
