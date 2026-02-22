/**
 * useEquipmentWorkOrder Hook Tests
 * File: useEquipmentWorkOrder.test.js
 */
import useEquipmentWorkOrder from '@hooks/useEquipmentWorkOrder';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentWorkOrder', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentWorkOrder);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
      'start',
      'returnToService',
    ]);
  });
});
