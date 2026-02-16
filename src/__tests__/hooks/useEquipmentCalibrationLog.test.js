/**
 * useEquipmentCalibrationLog Hook Tests
 * File: useEquipmentCalibrationLog.test.js
 */
import useEquipmentCalibrationLog from '@hooks/useEquipmentCalibrationLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentCalibrationLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentCalibrationLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
