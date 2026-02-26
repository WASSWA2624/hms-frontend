import { ClinicalResourceDetailScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function TheatreCasesDetailRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="detail"
      resource="theatre-cases"
      panel="snapshot"
      action="open_theatre_case"
      fallback={<ClinicalResourceDetailScreen resourceId="theatre-cases" />}
    />
  );
}
