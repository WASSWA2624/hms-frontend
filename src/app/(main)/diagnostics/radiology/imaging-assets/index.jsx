import { Redirect } from 'expo-router';

export default function LegacyImagingAssetsListRoute() {
  return <Redirect href="/radiology?resource=imaging-assets" />;
}
