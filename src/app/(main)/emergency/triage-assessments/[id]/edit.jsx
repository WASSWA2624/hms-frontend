import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function TriageAssessmentsEditRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="edit"
      resource="triage-assessments"
      panel="intake"
      action="update_triage"
      fallback={<ClinicalResourceFormScreen resourceId="triage-assessments" />}
    />
  );
}
