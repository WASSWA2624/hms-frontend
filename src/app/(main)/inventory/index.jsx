import { PHARMACY_WORKSPACE_V1 } from '@config/feature.flags';
import { ClinicalOverviewScreen, PharmacyWorkbenchScreen } from '@platform/screens';

export default function InventoryIndexRoute() {
  if (PHARMACY_WORKSPACE_V1) {
    return <PharmacyWorkbenchScreen defaultPanel="inventory" />;
  }

  return <ClinicalOverviewScreen scope="inventory" />;
}
