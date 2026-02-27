import { Redirect } from 'expo-router';

export default function RadiologyPacsLinksCreateRoute() {
  return <Redirect href="/radiology?resource=pacs-links&action=create" />;
}
