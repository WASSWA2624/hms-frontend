import { Redirect } from 'expo-router';

export default function RadiologyImagingStudiesCreateRoute() {
  return <Redirect href="/radiology?resource=imaging-studies&action=create" />;
}
