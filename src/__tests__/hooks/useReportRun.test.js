/**
 * useReportRun Hook Tests
 * File: useReportRun.test.js
 */
import useReportRun from '@hooks/useReportRun';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useReportRun', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useReportRun);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
