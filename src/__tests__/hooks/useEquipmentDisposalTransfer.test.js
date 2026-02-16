/**
 * useEquipmentDisposalTransfer Hook Tests
 * File: useEquipmentDisposalTransfer.test.js
 */
import useEquipmentDisposalTransfer from '@hooks/useEquipmentDisposalTransfer';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentDisposalTransfer', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentDisposalTransfer);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
