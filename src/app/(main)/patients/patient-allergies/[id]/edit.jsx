import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="care"
      panel="allergies"
      mode="edit"
      includeRouteIdAsRecordId
      testID="patients-legacy-allergies-edit-redirect"
    />
  );
}



