import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="identity"
      panel="contacts"
      mode="edit"
      includeRouteIdAsRecordId
      testID="patients-legacy-contacts-edit-redirect"
    />
  );
}



