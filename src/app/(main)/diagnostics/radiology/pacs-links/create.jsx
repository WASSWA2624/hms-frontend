import { Redirect } from 'expo-router';

export default function LegacyPacsLinksCreateRoute() {
  return <Redirect href="/radiology?resource=pacs-links&action=create" />;
}
