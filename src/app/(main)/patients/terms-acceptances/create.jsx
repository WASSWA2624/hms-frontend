import { LegacyLegalHubRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return <LegacyLegalHubRedirect tab="terms" mode="create" testID="patients-legacy-terms-create-redirect" />;
}


