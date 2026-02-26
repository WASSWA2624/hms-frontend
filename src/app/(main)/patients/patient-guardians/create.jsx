import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="identity"
      panel="guardians"
      mode="create"
      testID="patients-legacy-guardians-create-redirect"
    />
  );
}



