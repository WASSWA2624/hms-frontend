import { ClinicalResourceFormScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function TheatreCasesCreateRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="create"
      resource="theatre-cases"
      panel="snapshot"
      action="start_theatre_case"
      fallback={<ClinicalResourceFormScreen resourceId="theatre-cases" />}
    />
  );
}
