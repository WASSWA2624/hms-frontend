/**
 * usePatientGuardian Hook Tests
 * File: usePatientGuardian.test.js
 */
import usePatientGuardian from '@hooks/usePatientGuardian';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePatientGuardian', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePatientGuardian);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

