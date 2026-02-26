import { IPD_WORKBENCH_V1 } from '@config/feature.flags';
import { ClinicalOverviewScreen, IpdWorkbenchScreen } from '@platform/screens';

export default function IpdIndexRoute() {
  if (IPD_WORKBENCH_V1) {
    return <IpdWorkbenchScreen />;
  }

  return <ClinicalOverviewScreen scope="ipd" />;
}
