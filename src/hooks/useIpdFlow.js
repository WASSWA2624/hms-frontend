/**
 * useIpdFlow Hook
 * File: useIpdFlow.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  addMedicationAdministration,
  addNursingNote,
  addWardRound,
  assignBed,
  finalizeDischarge,
  getIpdFlow,
  listIpdFlows,
  planDischarge,
  releaseBed,
  requestTransfer,
  startIpdFlow,
  updateTransfer,
} from '@features/ipd-flow';

const useIpdFlow = () => {
  const actions = useMemo(
    () => ({
      list: listIpdFlows,
      get: getIpdFlow,
      start: startIpdFlow,
      assignBed,
      releaseBed,
      requestTransfer,
      updateTransfer,
      addWardRound,
      addNursingNote,
      addMedicationAdministration,
      planDischarge,
      finalizeDischarge,
    }),
    []
  );

  return useCrud(actions);
};

export default useIpdFlow;
