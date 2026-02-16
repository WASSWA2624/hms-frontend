/**
 * useDashboardWidget Hook Tests
 * File: useDashboardWidget.test.js
 */
import useDashboardWidget from '@hooks/useDashboardWidget';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useDashboardWidget', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useDashboardWidget);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
