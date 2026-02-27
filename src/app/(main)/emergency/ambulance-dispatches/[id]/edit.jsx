import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceDispatchesEditRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="edit"
      resource="ambulance-dispatches"
      panel="dispatch"
      action="update_dispatch"
      fallback={<ClinicalResourceFormScreen resourceId="ambulance-dispatches" />}
    />
  );
}
