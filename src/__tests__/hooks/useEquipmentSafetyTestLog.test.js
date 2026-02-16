/**
 * useEquipmentSafetyTestLog Hook Tests
 * File: useEquipmentSafetyTestLog.test.js
 */
import useEquipmentSafetyTestLog from '@hooks/useEquipmentSafetyTestLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentSafetyTestLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentSafetyTestLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
