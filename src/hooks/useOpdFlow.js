/**
 * useOpdFlow Hook
 * File: useOpdFlow.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  assignDoctor,
  disposition,
  doctorReview,
  getOpdFlow,
  listOpdFlows,
  payConsultation,
  recordVitals,
  startOpdFlow,
} from '@features/opd-flow';

const useOpdFlow = () => {
  const actions = useMemo(
    () => ({
      list: listOpdFlows,
      get: getOpdFlow,
      start: startOpdFlow,
      payConsultation,
      recordVitals,
      assignDoctor,
      doctorReview,
      disposition,
    }),
    []
  );

  return useCrud(actions);
};

export default useOpdFlow;
