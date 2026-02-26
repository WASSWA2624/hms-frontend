import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="documents"
      panel="documents"
      mode="create"
      testID="patients-legacy-documents-create-redirect"
    />
  );
}



