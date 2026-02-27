import { ClinicalResourceListScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyCasesListRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="list"
      resource="emergency-cases"
      panel="queue"
      action="open_case_list"
      fallback={<ClinicalResourceListScreen resourceId="emergency-cases" />}
    />
  );
}
