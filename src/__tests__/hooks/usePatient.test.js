/**
 * usePatient Hook Tests
 * File: usePatient.test.js
 */
import usePatient from '@hooks/usePatient';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePatient', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePatient);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
    expect(typeof result.listIdentifiers).toBe('function');
    expect(typeof result.listContacts).toBe('function');
    expect(typeof result.listGuardians).toBe('function');
    expect(typeof result.listAllergies).toBe('function');
    expect(typeof result.listMedicalHistories).toBe('function');
    expect(typeof result.listDocuments).toBe('function');
  });
});
