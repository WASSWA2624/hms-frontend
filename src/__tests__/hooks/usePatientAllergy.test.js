/**
 * usePatientAllergy Hook Tests
 * File: usePatientAllergy.test.js
 */
import usePatientAllergy from '@hooks/usePatientAllergy';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePatientAllergy', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePatientAllergy);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

