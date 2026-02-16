/**
 * useEquipmentWarrantyContract Hook Tests
 * File: useEquipmentWarrantyContract.test.js
 */
import useEquipmentWarrantyContract from '@hooks/useEquipmentWarrantyContract';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentWarrantyContract', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentWarrantyContract);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
