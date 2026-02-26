import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function DischargeSummariesCreateRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="create"
      resource="discharge-summaries"
      panel="discharge"
      action="plan_discharge"
      fallback={<ClinicalResourceFormScreen resourceId="discharge-summaries" />}
    />
  );
}

