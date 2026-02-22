import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="care"
      panel="allergies"
      testID="patients-legacy-allergies-create-redirect"
    />
  );
}

