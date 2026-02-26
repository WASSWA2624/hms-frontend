import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="identity"
      panel="identifiers"
      mode="create"
      testID="patients-legacy-identifiers-create-redirect"
    />
  );
}



