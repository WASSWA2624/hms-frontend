import { Redirect } from 'expo-router';

export default function LegacyImagingAssetsCreateRoute() {
  return <Redirect href="/radiology?resource=imaging-assets&action=create" />;
}
