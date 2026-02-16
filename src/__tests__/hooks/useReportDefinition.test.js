/**
 * useReportDefinition Hook Tests
 * File: useReportDefinition.test.js
 */
import useReportDefinition from '@hooks/useReportDefinition';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useReportDefinition', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useReportDefinition);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
