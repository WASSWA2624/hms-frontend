/**
 * useEquipmentLocationHistory Hook Tests
 * File: useEquipmentLocationHistory.test.js
 */
import useEquipmentLocationHistory from '@hooks/useEquipmentLocationHistory';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentLocationHistory', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentLocationHistory);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
