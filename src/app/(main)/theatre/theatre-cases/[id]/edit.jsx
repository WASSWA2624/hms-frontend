import { ClinicalResourceFormScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function TheatreCasesEditRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="edit"
      resource="theatre-cases"
      panel="snapshot"
      action="update_theatre_case"
      fallback={<ClinicalResourceFormScreen resourceId="theatre-cases" />}
    />
  );
}
