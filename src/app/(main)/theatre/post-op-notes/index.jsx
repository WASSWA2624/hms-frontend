import { ClinicalResourceListScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function PostOpNotesListRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="list"
      resource="post-op-notes"
      panel="post-op"
      action="open_post_op_notes"
      fallback={<ClinicalResourceListScreen resourceId="post-op-notes" />}
    />
  );
}
