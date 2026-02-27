import { ClinicalResourceDetailScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function TriageAssessmentsDetailRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="detail"
      resource="triage-assessments"
      panel="intake"
      action="open_triage"
      fallback={<ClinicalResourceDetailScreen resourceId="triage-assessments" />}
    />
  );
}
