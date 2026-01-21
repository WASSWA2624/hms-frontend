/**
 * useAppointmentParticipant Hook Tests
 * File: useAppointmentParticipant.test.js
 */
import useAppointmentParticipant from '@hooks/useAppointmentParticipant';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAppointmentParticipant', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAppointmentParticipant);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
