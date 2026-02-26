/**
 * useTheatreFlow Hook
 * File: useTheatreFlow.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  addTheatreAnesthesiaObservation,
  assignTheatreResource,
  finalizeTheatreRecord,
  getTheatreFlow,
  listTheatreFlows,
  releaseTheatreResource,
  reopenTheatreRecord,
  resolveTheatreLegacyRoute,
  startTheatreFlow,
  toggleTheatreChecklistItem,
  updateTheatreStage,
  upsertTheatreAnesthesiaRecord,
  upsertTheatrePostOpNote,
} from '@features/theatre-flow';

const useTheatreFlow = () => {
  const actions = useMemo(
    () => ({
      list: listTheatreFlows,
      get: getTheatreFlow,
      resolveLegacyRoute: resolveTheatreLegacyRoute,
      start: startTheatreFlow,
      updateStage: updateTheatreStage,
      upsertAnesthesiaRecord: upsertTheatreAnesthesiaRecord,
      addAnesthesiaObservation: addTheatreAnesthesiaObservation,
      upsertPostOpNote: upsertTheatrePostOpNote,
      toggleChecklistItem: toggleTheatreChecklistItem,
      assignResource: assignTheatreResource,
      releaseResource: releaseTheatreResource,
      finalizeRecord: finalizeTheatreRecord,
      reopenRecord: reopenTheatreRecord,
    }),
    []
  );

  return useCrud(actions);
};

export default useTheatreFlow;
