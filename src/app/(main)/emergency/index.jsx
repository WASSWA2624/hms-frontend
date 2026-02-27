import { EMERGENCY_WORKBENCH_V1 } from '@config/feature.flags';
import { ClinicalOverviewScreen, EmergencyWorkbenchScreen } from '@platform/screens';

export default function EmergencyIndexRoute() {
  if (EMERGENCY_WORKBENCH_V1) {
    return <EmergencyWorkbenchScreen />;
  }

  return <ClinicalOverviewScreen scope="emergency" />;
}
