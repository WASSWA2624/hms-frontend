import { LegacyLegalHubRedirect } from '@platform/screens/patients/legacyRouteRedirects';

export default function PatientsLegacyRoute() {
  return <LegacyLegalHubRedirect tab="terms" testID="patients-legacy-terms-create-redirect" />;
}

