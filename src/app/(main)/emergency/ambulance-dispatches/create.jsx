import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceDispatchesCreateRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="create"
      resource="ambulance-dispatches"
      panel="dispatch"
      action="manage_dispatch"
      fallback={<ClinicalResourceFormScreen resourceId="ambulance-dispatches" />}
    />
  );
}
