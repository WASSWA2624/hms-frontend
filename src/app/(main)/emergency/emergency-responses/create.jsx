import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyResponsesCreateRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="create"
      resource="emergency-responses"
      panel="responses"
      action="add_response"
      fallback={<ClinicalResourceFormScreen resourceId="emergency-responses" />}
    />
  );
}
