import { ClinicalResourceListScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyResponsesListRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="list"
      resource="emergency-responses"
      panel="responses"
      action="open_response_list"
      fallback={<ClinicalResourceListScreen resourceId="emergency-responses" />}
    />
  );
}
