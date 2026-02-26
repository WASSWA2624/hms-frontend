import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="care"
      panel="histories"
      mode="edit"
      includeRouteIdAsRecordId
      testID="patients-legacy-histories-edit-redirect"
    />
  );
}



