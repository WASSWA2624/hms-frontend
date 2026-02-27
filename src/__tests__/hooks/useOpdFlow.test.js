/**
 * useOpdFlow Hook Tests
 * File: useOpdFlow.test.js
 */
import useOpdFlow from '@hooks/useOpdFlow';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useOpdFlow', () => {
  it('exposes OPD flow actions', () => {
    const result = renderHookResult(useOpdFlow);
    expectCrudHook(result, [
      'list',
      'get',
      'resolveLegacyRoute',
      'start',
      'bootstrap',
      'payConsultation',
      'recordVitals',
      'assignDoctor',
      'doctorReview',
      'disposition',
      'correctStage',
    ]);
  });
});
