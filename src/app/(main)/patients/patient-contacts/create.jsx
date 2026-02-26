import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="identity"
      panel="contacts"
      mode="create"
      testID="patients-legacy-contacts-create-redirect"
    />
  );
}



