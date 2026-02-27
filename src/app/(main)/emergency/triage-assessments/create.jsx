import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function TriageAssessmentsCreateRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="create"
      resource="triage-assessments"
      panel="intake"
      action="add_triage"
      fallback={<ClinicalResourceFormScreen resourceId="triage-assessments" />}
    />
  );
}
