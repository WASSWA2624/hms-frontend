import { Redirect } from 'expo-router';

export default function LegacyImagingStudiesCreateRoute() {
  return <Redirect href="/radiology?resource=imaging-studies&action=create" />;
}
