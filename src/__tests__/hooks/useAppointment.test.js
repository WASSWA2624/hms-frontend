/**
 * useAppointment Hook Tests
 * File: useAppointment.test.js
 */
import useAppointment from '@hooks/useAppointment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAppointment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAppointment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
