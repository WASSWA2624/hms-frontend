/**
 * useIpdFlow Hook
 * File: useIpdFlow.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  addCriticalAlert,
  addIcuObservation,
  addMedicationAdministration,
  addNursingNote,
  addWardRound,
  assignBed,
  endIcuStay,
  finalizeDischarge,
  getIpdFlow,
  listIpdFlows,
  planDischarge,
  releaseBed,
  resolveIpdLegacyRoute,
  requestTransfer,
  resolveCriticalAlert,
  startIcuStay,
  startIpdFlow,
  updateTransfer,
} from '@features/ipd-flow';

const useIpdFlow = () => {
  const actions = useMemo(
    () => ({
      list: listIpdFlows,
      get: getIpdFlow,
      resolveLegacyRoute: resolveIpdLegacyRoute,
      start: startIpdFlow,
      startIcuStay,
      endIcuStay,
      addIcuObservation,
      addCriticalAlert,
      resolveCriticalAlert,
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
