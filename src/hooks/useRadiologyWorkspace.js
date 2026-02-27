/**
 * useRadiologyWorkspace Hook
 * File: useRadiologyWorkspace.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  addendumRadiologyResult,
  assignRadiologyOrder,
  commitStudyAssetUpload,
  completeRadiologyOrder,
  createRadiologyStudy,
  draftRadiologyResult,
  requestRadiologyResultFinalization,
  attestRadiologyResultFinalization,
  finalizeRadiologyResult,
  getRadiologyOrderWorkflow,
  initStudyAssetUpload,
  listRadiologyWorkbench,
  resolveRadiologyLegacyRoute,
  startRadiologyOrder,
  syncRadiologyStudy,
  cancelRadiologyOrder,
} from '@features/radiology-workspace';

const useRadiologyWorkspace = () => {
  const actions = useMemo(
    () => ({
      listWorkbench: listRadiologyWorkbench,
      getWorkflow: getRadiologyOrderWorkflow,
      resolveLegacyRoute: resolveRadiologyLegacyRoute,
      assignOrder: assignRadiologyOrder,
      startOrder: startRadiologyOrder,
      completeOrder: completeRadiologyOrder,
      cancelOrder: cancelRadiologyOrder,
      createStudy: createRadiologyStudy,
      initUpload: initStudyAssetUpload,
      commitUpload: commitStudyAssetUpload,
      syncStudy: syncRadiologyStudy,
      draftResult: draftRadiologyResult,
      finalizeResult: finalizeRadiologyResult,
      requestFinalizationResult: requestRadiologyResultFinalization,
      attestFinalizationResult: attestRadiologyResultFinalization,
      addendumResult: addendumRadiologyResult,
    }),
    []
  );

  return useCrud(actions);
};

export default useRadiologyWorkspace;
