import { ClinicalResourceDetailScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceDispatchesDetailRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="detail"
      resource="ambulance-dispatches"
      panel="dispatch"
      action="manage_dispatch"
      fallback={<ClinicalResourceDetailScreen resourceId="ambulance-dispatches" />}
    />
  );
}
