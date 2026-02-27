import { Redirect } from 'expo-router';

export default function LegacyImagingStudiesListRoute() {
  return <Redirect href="/radiology?resource=imaging-studies" />;
}
