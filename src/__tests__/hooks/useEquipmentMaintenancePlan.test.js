/**
 * useEquipmentMaintenancePlan Hook Tests
 * File: useEquipmentMaintenancePlan.test.js
 */
import useEquipmentMaintenancePlan from '@hooks/useEquipmentMaintenancePlan';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentMaintenancePlan', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentMaintenancePlan);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
