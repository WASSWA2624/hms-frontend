/**
 * usePatientIdentifier Hook Tests
 * File: usePatientIdentifier.test.js
 */
import usePatientIdentifier from '@hooks/usePatientIdentifier';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePatientIdentifier', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePatientIdentifier);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

