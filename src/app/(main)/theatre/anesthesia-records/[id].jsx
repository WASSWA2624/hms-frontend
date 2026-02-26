import { ClinicalResourceDetailScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function AnesthesiaRecordsDetailRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="detail"
      resource="anesthesia-records"
      panel="anesthesia"
      action="open_anesthesia_record"
      fallback={
        <ClinicalResourceDetailScreen resourceId="anesthesia-records" />
      }
    />
  );
}
