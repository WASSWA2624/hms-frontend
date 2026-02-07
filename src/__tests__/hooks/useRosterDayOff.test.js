/**
 * useRosterDayOff Hook Tests
 * File: useRosterDayOff.test.js
 */
import useRosterDayOff from '@hooks/useRosterDayOff';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRosterDayOff', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRosterDayOff);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

