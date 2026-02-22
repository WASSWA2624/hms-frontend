/**
 * useDischargeSummary Hook Tests
 * File: useDischargeSummary.test.js
 */
import useDischargeSummary from '@hooks/useDischargeSummary';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useDischargeSummary', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useDischargeSummary);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'finalize']);
  });
});
