/**
 * useEquipmentCategory Hook Tests
 * File: useEquipmentCategory.test.js
 */
import useEquipmentCategory from '@hooks/useEquipmentCategory';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentCategory', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentCategory);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
