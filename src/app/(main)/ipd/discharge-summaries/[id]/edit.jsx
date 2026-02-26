import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function DischargeSummariesEditRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="edit"
      resource="discharge-summaries"
      panel="discharge"
      action="update_discharge"
      fallback={<ClinicalResourceFormScreen resourceId="discharge-summaries" />}
    />
  );
}

