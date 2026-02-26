import { ClinicalResourceListScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function DischargeSummariesListRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode=\"list\"
      resource=\"discharge-summaries\"
      panel=\"discharge\"
      action=\"open_discharge\"
      fallback={<ClinicalResourceListScreen resourceId=\"discharge-summaries\" />}
    />
  );
}
