import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="care"
      panel="histories"
      testID="patients-legacy-histories-index-redirect"
    />
  );
}

