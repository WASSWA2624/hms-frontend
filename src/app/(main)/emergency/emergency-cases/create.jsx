import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function EmergencyCasesCreateRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="create"
      resource="emergency-cases"
      panel="intake"
      action="create_case"
      fallback={<ClinicalResourceFormScreen resourceId="emergency-cases" />}
    />
  );
}
