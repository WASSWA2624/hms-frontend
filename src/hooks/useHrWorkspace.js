import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  listHrWorkspace,
  listHrWorkItems,
  getHrRosterWorkflow,
  generateHrRoster,
  publishHrRoster,
  overrideHrShift,
  approveHrSwap,
  rejectHrSwap,
  approveHrLeave,
  rejectHrLeave,
  previewHrPayrollRun,
  processHrPayrollRun,
  resolveHrLegacyRoute,
} from '@features/hr-workspace';

const useHrWorkspace = () => {
  const actions = useMemo(
    () => ({
      listWorkspace: listHrWorkspace,
      listWorkItems: listHrWorkItems,
      getRosterWorkflow: getHrRosterWorkflow,
      generateRoster: generateHrRoster,
      publishRoster: publishHrRoster,
      overrideShift: overrideHrShift,
      approveSwap: approveHrSwap,
      rejectSwap: rejectHrSwap,
      approveLeave: approveHrLeave,
      rejectLeave: rejectHrLeave,
      previewPayrollRun: previewHrPayrollRun,
      processPayrollRun: processHrPayrollRun,
      resolveLegacyRoute: resolveHrLegacyRoute,
    }),
    []
  );

  return useCrud(actions);
};

export default useHrWorkspace;
