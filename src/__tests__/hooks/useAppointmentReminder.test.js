/**
 * useAppointmentReminder Hook Tests
 * File: useAppointmentReminder.test.js
 */
import useAppointmentReminder from '@hooks/useAppointmentReminder';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAppointmentReminder', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAppointmentReminder);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'markSent']);
  });
});
