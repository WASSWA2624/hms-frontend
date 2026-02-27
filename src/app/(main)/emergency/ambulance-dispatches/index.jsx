import { ClinicalResourceListScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceDispatchesListRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="list"
      resource="ambulance-dispatches"
      panel="dispatch"
      action="open_dispatch_list"
      fallback={<ClinicalResourceListScreen resourceId="ambulance-dispatches" />}
    />
  );
}
