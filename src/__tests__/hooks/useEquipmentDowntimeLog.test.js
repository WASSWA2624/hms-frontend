/**
 * useEquipmentDowntimeLog Hook Tests
 * File: useEquipmentDowntimeLog.test.js
 */
import useEquipmentDowntimeLog from '@hooks/useEquipmentDowntimeLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentDowntimeLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentDowntimeLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
