import { ClinicalResourceDetailScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function DischargeSummariesDetailRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="detail"
      resource="discharge-summaries"
      panel="discharge"
      action="plan_discharge"
      fallback={<ClinicalResourceDetailScreen resourceId="discharge-summaries" />}
    />
  );
}

