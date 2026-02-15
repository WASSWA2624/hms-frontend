/**
 * usePatientMedicalHistory Hook Tests
 * File: usePatientMedicalHistory.test.js
 */
import usePatientMedicalHistory from '@hooks/usePatientMedicalHistory';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePatientMedicalHistory', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePatientMedicalHistory);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

