import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyResponsesEditRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="edit"
      resource="emergency-responses"
      panel="responses"
      action="update_response"
      fallback={<ClinicalResourceFormScreen resourceId="emergency-responses" />}
    />
  );
}
