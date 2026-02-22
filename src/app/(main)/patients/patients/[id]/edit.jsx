import { LegacyWorkspaceRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientRecordsEditRoute() {
  return (
    <LegacyWorkspaceRedirect
      tab="summary"
      mode="edit"
      includeRouteIdAsPatientContext
      testID="patients-legacy-patient-edit-redirect"
    />
  );
}
