import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="documents"
      panel="documents"
      testID="patients-legacy-documents-edit-redirect"
    />
  );
}

