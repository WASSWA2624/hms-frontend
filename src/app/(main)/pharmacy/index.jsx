import { PHARMACY_WORKSPACE_V1 } from '@config/feature.flags';
import { ClinicalOverviewScreen, PharmacyWorkbenchScreen } from '@platform/screens';

export default function PharmacyIndexRoute() {
  if (PHARMACY_WORKSPACE_V1) {
    return <PharmacyWorkbenchScreen />;
  }

  return <ClinicalOverviewScreen scope="pharmacy" />;
}
