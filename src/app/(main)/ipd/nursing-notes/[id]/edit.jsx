import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function NursingNotesEditRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="edit"
      resource="nursing-notes"
      panel="nursing"
      action="update_nursing_note"
      fallback={<ClinicalResourceFormScreen resourceId="nursing-notes" />}
    />
  );
}

