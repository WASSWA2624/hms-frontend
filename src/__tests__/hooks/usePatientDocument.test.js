/**
 * usePatientDocument Hook Tests
 * File: usePatientDocument.test.js
 */
import usePatientDocument from '@hooks/usePatientDocument';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePatientDocument', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePatientDocument);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

