/**
 * useOpdFlow Hook
 * File: useOpdFlow.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  assignDoctor,
  correctStage,
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
      correctStage,
    }),
    []
  );

  return useCrud(actions);
};

export default useOpdFlow;
