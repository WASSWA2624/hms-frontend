/**
 * useLabWorkspace Hook
 * File: useLabWorkspace.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  collectLabOrder,
  getLabOrderWorkflow,
  listLabWorkbench,
  receiveLabSample,
  rejectLabSample,
  releaseLabOrderItem,
  resolveLabLegacyRoute,
} from '@features/lab-workspace';

const useLabWorkspace = () => {
  const actions = useMemo(
    () => ({
      listWorkbench: listLabWorkbench,
      getWorkflow: getLabOrderWorkflow,
      resolveLegacyRoute: resolveLabLegacyRoute,
      collect: collectLabOrder,
      receive: receiveLabSample,
      reject: rejectLabSample,
      release: releaseLabOrderItem,
    }),
    []
  );

  return useCrud(actions);
};

export default useLabWorkspace;
