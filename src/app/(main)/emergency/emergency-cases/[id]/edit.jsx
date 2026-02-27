import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyCasesEditRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="edit"
      resource="emergency-cases"
      panel="intake"
      action="update_case"
      fallback={<ClinicalResourceFormScreen resourceId="emergency-cases" />}
    />
  );
}
