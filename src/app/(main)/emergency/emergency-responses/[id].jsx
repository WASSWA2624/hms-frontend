import { ClinicalResourceDetailScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyResponsesDetailRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="detail"
      resource="emergency-responses"
      panel="responses"
      action="open_response"
      fallback={<ClinicalResourceDetailScreen resourceId="emergency-responses" />}
    />
  );
}
