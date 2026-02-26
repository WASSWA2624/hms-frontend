import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="documents"
      panel="documents"
      mode="edit"
      includeRouteIdAsRecordId
      testID="patients-legacy-documents-edit-redirect"
    />
  );
}



