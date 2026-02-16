/**
 * useEquipmentRegistry Hook Tests
 * File: useEquipmentRegistry.test.js
 */
import useEquipmentRegistry from '@hooks/useEquipmentRegistry';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentRegistry', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentRegistry);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
