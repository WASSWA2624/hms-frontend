import { Redirect } from 'expo-router';

export default function RadiologyImagingAssetsCreateRoute() {
  return <Redirect href="/radiology?resource=imaging-assets&action=create" />;
}
