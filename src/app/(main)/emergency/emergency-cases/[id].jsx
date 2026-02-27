import { ClinicalResourceDetailScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyCasesDetailRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="detail"
      resource="emergency-cases"
      panel="queue"
      action="open_case"
      fallback={<ClinicalResourceDetailScreen resourceId="emergency-cases" />}
    />
  );
}
