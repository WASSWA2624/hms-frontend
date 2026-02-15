/**
 * usePatientContact Hook Tests
 * File: usePatientContact.test.js
 */
import usePatientContact from '@hooks/usePatientContact';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePatientContact', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePatientContact);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

