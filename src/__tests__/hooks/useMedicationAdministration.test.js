/**
 * useMedicationAdministration Hook Tests
 * File: useMedicationAdministration.test.js
 */
import useMedicationAdministration from '@hooks/useMedicationAdministration';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useMedicationAdministration', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useMedicationAdministration);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
