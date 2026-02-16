/**
 * useEquipmentUtilizationSnapshot Hook Tests
 * File: useEquipmentUtilizationSnapshot.test.js
 */
import useEquipmentUtilizationSnapshot from '@hooks/useEquipmentUtilizationSnapshot';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentUtilizationSnapshot', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentUtilizationSnapshot);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
