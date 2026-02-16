/**
 * useEquipmentIncidentReport Hook Tests
 * File: useEquipmentIncidentReport.test.js
 */
import useEquipmentIncidentReport from '@hooks/useEquipmentIncidentReport';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEquipmentIncidentReport', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEquipmentIncidentReport);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
