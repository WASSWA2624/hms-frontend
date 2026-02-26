import { ClinicalResourceDetailScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function PostOpNotesDetailRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="detail"
      resource="post-op-notes"
      panel="post-op"
      action="open_post_op_note"
      fallback={<ClinicalResourceDetailScreen resourceId="post-op-notes" />}
    />
  );
}
