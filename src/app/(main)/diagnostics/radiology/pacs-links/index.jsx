import { Redirect } from 'expo-router';

export default function LegacyPacsLinksListRoute() {
  return <Redirect href="/radiology?resource=pacs-links" />;
}
