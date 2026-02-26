import { LegacyLegalHubRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return <LegacyLegalHubRedirect tab="consents" mode="edit" includeRouteIdAsRecordId testID="patients-legacy-consents-edit-redirect" />;
}


