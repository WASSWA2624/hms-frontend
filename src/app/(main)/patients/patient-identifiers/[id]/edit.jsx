import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="identity"
      panel="identifiers"
      mode="edit"
      includeRouteIdAsRecordId
      testID="patients-legacy-identifiers-edit-redirect"
    />
  );
}



