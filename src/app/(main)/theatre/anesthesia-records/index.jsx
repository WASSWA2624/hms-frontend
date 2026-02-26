import { ClinicalResourceListScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function AnesthesiaRecordsListRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="list"
      resource="anesthesia-records"
      panel="anesthesia"
      action="open_anesthesia_records"
      fallback={<ClinicalResourceListScreen resourceId="anesthesia-records" />}
    />
  );
}
