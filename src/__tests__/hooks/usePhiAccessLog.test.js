/**
 * usePhiAccessLog Hook Tests
 * File: usePhiAccessLog.test.js
 */
import usePhiAccessLog from '@hooks/usePhiAccessLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePhiAccessLog', () => {
  it('exposes mounted PHI access log handlers', () => {
    const result = renderHookResult(usePhiAccessLog);
    expectCrudHook(result, ['list', 'get', 'create', 'listByUser']);
  });
});
