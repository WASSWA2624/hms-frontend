import { LegacyLegalHubRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return <LegacyLegalHubRedirect tab="consents" mode="create" testID="patients-legacy-consents-create-redirect" />;
}


