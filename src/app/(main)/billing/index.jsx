import { BILLING_WORKSPACE_V1 } from '@config/feature.flags';
import { BillingWorkbenchScreen, ClinicalOverviewScreen } from '@platform/screens';

export default function BillingIndexRoute() {
  if (BILLING_WORKSPACE_V1) {
    return <BillingWorkbenchScreen />;
  }

  return <ClinicalOverviewScreen scope="billing" />;
}
