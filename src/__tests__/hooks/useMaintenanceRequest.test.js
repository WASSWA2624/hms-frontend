/**
 * useMaintenanceRequest Hook Tests
 * File: useMaintenanceRequest.test.js
 */
import useMaintenanceRequest from '@hooks/useMaintenanceRequest';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useMaintenanceRequest', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useMaintenanceRequest);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'triage']);
  });
});
