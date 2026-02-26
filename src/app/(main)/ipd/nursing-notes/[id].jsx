import { ClinicalResourceDetailScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function NursingNotesDetailRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="detail"
      resource="nursing-notes"
      panel="nursing"
      action="add_nursing_note"
      fallback={<ClinicalResourceDetailScreen resourceId="nursing-notes" />}
    />
  );
}

