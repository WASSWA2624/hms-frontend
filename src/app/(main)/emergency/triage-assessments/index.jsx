import { ClinicalResourceListScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function TriageAssessmentsListRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="list"
      resource="triage-assessments"
      panel="intake"
      action="open_triage_list"
      fallback={<ClinicalResourceListScreen resourceId="triage-assessments" />}
    />
  );
}
