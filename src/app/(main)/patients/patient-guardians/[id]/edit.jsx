import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="identity"
      panel="guardians"
      mode="edit"
      includeRouteIdAsRecordId
      testID="patients-legacy-guardians-edit-redirect"
    />
  );
}



