import { ClinicalResourceDetailScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceTripsDetailRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="detail"
      resource="ambulance-trips"
      panel="trips"
      action="manage_trip"
      fallback={<ClinicalResourceDetailScreen resourceId="ambulance-trips" />}
    />
  );
}
