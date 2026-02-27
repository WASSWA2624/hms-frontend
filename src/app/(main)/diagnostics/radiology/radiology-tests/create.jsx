import { Redirect } from 'expo-router';

export default function LegacyRadiologyTestsCreateRoute() {
  return <Redirect href="/radiology?resource=radiology-tests&action=create" />;
}
