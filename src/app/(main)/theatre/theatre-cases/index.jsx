import { ClinicalResourceListScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function TheatreCasesListRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="list"
      resource="theatre-cases"
      panel="snapshot"
      action="open_theatre_case_list"
      fallback={<ClinicalResourceListScreen resourceId="theatre-cases" />}
    />
  );
}
