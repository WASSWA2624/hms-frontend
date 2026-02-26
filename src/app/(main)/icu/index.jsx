import { ICU_WORKBENCH_V1 } from '@config/feature.flags';
import { ClinicalOverviewScreen, IcuWorkbenchScreen } from '@platform/screens';

export default function IcuIndexRoute() {
  if (ICU_WORKBENCH_V1) {
    return <IcuWorkbenchScreen />;
  }

  return <ClinicalOverviewScreen scope="icu" />;
}
