/**
 * useEquipmentRecallNotice Hook Tests
 * File: useEquipmentRecallNotice.test.js
 */
import useEquipmentRecallNotice from '@hooks/useEquipmentRecallNotice';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentRecallNotice', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentRecallNotice);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
